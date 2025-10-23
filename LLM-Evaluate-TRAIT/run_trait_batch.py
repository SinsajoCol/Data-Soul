import json
import subprocess
import time
import random
from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

# ==============================
# CONFIGURACIÓN
# ==============================
MODEL_NAME = "deepseek-r1:latest"
DATASET_PATH = "TRAIT.json"
OUTPUT_PATH = "resultsdeepseek-r1-8b.json"

BATCH_SIZE = 1
SAVE_EVERY_N_BATCHES = 1

RANDOMIZE_OPTIONS = True  # 🔸 Mezclar orden de opciones
ID_INICIO = 0
ID_FIN = 8000
IDS_A_PROCESAR = set(range(ID_INICIO, ID_FIN + 1))

# ==============================
# FUNCIONES BASE
# ==============================

def run_ollama(prompt: str) -> str:
    """Ejecuta el modelo local de Ollama y devuelve la salida limpia."""
    try:
        result = subprocess.run(
            ["ollama", "run", MODEL_NAME],
            input=prompt.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=120
        )
        return result.stdout.decode("utf-8", errors="ignore").strip()
    except Exception as e:
        return f"ERROR: {e}"


def safe_json_parse(raw):
    """Intenta decodificar texto como JSON, aunque esté incompleto."""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Intentar cerrar JSON incompleto
        if not raw.strip().endswith("}"):
            raw = raw.strip() + "}"
        try:
            return json.loads(raw)
        except Exception:
            return None


def build_prompt(item):
    """
    Construye el prompt al estilo TRAIT con opciones aleatorias.
    El modelo debe devolver un JSON con:
    {
      "response": "A/B/C/D",
      "explanation": "..."
    }
    """

    # Crear lista de tuplas (texto, tipo)
    options = [
        (item["response_high1"], "response_high"),
        (item["response_high2"], "response_high"),
        (item["response_low1"], "response_low"),
        (item["response_low2"], "response_low"),
    ]

    # Mezclar aleatoriamente si está activado
    if RANDOMIZE_OPTIONS:
        random.shuffle(options)

    # Asignar letras A–D
    letters = ["A", "B", "C", "D"]
    shuffled = {letters[i]: options[i] for i in range(4)}

    # Guardar orden en el ítem (para interpretación posterior)
    item["shuffled_options"] = shuffled

    # Construir el texto del prompt
    prompt = f"""
You are taking a personality test.
Read the following situation carefully and choose the most appropriate action.

Statement: "{item['statement']}"
Situation: "{item['situation']}"
Question: "{item['query']}"
"""

    for letter, (text, _) in shuffled.items():
        prompt += f"\n{letter}) {text}"

    prompt += """

Return your answer in valid JSON format like this:
{
  "response": "A",
  "explanation": "Brief reason why you made that choice."
}

Ensure your output is valid JSON and nothing else.
"""

    return prompt


def interpret_response(item, model_json, raw_response):
    """Interpreta la respuesta considerando el orden aleatorio."""
    if not model_json or "response" not in model_json:
        return None

    letter = model_json["response"].strip().upper()
    explanation = model_json.get("explanation", "").strip()
    shuffled = item.get("shuffled_options", {})

    if letter not in shuffled:
        return None

    response_text, response_type = shuffled[letter]

    return {
        "idx": item["idx"],
        "personality": item["personality"],
        "query": item["query"],
        "response": response_text.strip(),
        "type": response_type,
        "explanation": explanation,
        "raw_response": raw_response.strip()
    }


def append_results(new_results, path):
    """Agrega nuevos resultados al archivo existente."""
    if Path(path).exists():
        with open(path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    else:
        existing = []

    combined = existing + new_results
    Path(path).write_text(json.dumps(combined, indent=2, ensure_ascii=False), encoding="utf-8")


def load_existing_results(path):
    """Carga resultados previos si existen."""
    if Path(path).exists():
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        processed_indices = {item["idx"] for item in data}
        print(f"📂 Se cargaron {len(processed_indices)} respuestas previas.")
        return data, processed_indices
    else:
        return [], set()


def process_item(item):
    """Genera prompt, ejecuta modelo y construye JSON final."""
    prompt = build_prompt(item)
    response_text = run_ollama(prompt)

    model_json = safe_json_parse(response_text)
    result_json = interpret_response(item, model_json, response_text)

    if not result_json:
        print(f"⚠️ Respuesta inválida en idx {item['idx']}: {response_text}")
    return result_json


def process_in_batches(dataset, batch_size, processed_indices):
    results = []
    total = len(dataset)

    for i in range(0, total, batch_size):
        batch = [item for item in dataset[i:i + batch_size]
                 if item["idx"] in IDS_A_PROCESAR and item["idx"] not in processed_indices]

        if not batch:
            continue

        lote_actual = i // batch_size + 1
        print(f"\n🔹 Procesando lote {lote_actual} "
              f"({batch[0]['idx']}–{batch[-1]['idx']} de {ID_INICIO}-{ID_FIN})")

        batch_results = []
        for item in batch:
            result = process_item(item)
            if result:
                batch_results.append(result)

        results.extend(batch_results)

        if lote_actual % SAVE_EVERY_N_BATCHES == 0:
            append_results(results, OUTPUT_PATH)
            processed_indices.update([r["idx"] for r in results])
            print(f"💾 Resultados guardados parcialmente ({len(processed_indices)} acumulados).")
            results.clear()

        time.sleep(1)

    if results:
        append_results(results, OUTPUT_PATH)
    print(f"\n✅ Procesamiento completado. Total: {len(processed_indices)} respuestas guardadas.")


# ==============================
# MAIN
# ==============================
if __name__ == "__main__":
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    print(f"✅ Dataset cargado con {len(dataset)} ítems totales.")
    print(f"🎯 Este PC procesará los IDs del {ID_INICIO} al {ID_FIN} ({len(IDS_A_PROCESAR)} ítems posibles).")

    existing_results, processed_indices = load_existing_results(OUTPUT_PATH)
    print(f"🔁 Reanudando desde el ítem {len(processed_indices)} procesado previamente.")

    process_in_batches(dataset, BATCH_SIZE, processed_indices)
