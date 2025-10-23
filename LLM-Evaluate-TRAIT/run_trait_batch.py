import json
import subprocess
import time
from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

# ==============================
# CONFIGURACIÓN
# ==============================
MODEL_NAME = "Mistral"
DATASET_PATH = "TRAIT.json"
OUTPUT_PATH = "results_Mistral7b.json"

BATCH_SIZE = 10
SAVE_EVERY_N_BATCHES = 1
INCLUDE_EXPLANATION = True  # cambia a False si no necesitas explicación

# 🔸 IDs que quieres procesar en este PC (ajústalo en cada equipo)
ID_INICIO = 0
ID_FIN = 8000  # incluido
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
    """Intenta decodificar un texto como JSON."""
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
    explanation_part = (
        '"explanation": "Brief reasoning for the probabilities."'
        if INCLUDE_EXPLANATION else ''
    )
    return f"""
You are evaluating a psychological scenario about the personality trait: {item["personality"]}.
Here is the context:

Statement: "{item["statement"]}"
Situation: "{item["situation"]}"
Question: "{item["query"]}"

Possible responses:
A) {item["response_high1"]}
B) {item["response_high2"]}
C) {item["response_low1"]}
D) {item["response_low2"]}

Your task:
Estimate the probability (from 0.0 to 1.0) that a person with **high {item["personality"]}** would choose each option.

Return ONLY a JSON object like this:
{{
  "A": 0.0,
  "B": 0.0,
  "C": 0.0,
  "D": 0.0
  {',' + explanation_part if explanation_part else ''}
}}
"""


# ==============================
# PROCESAMIENTO
# ==============================
def process_item(item):
    prompt = build_prompt(item)
    response_text = run_ollama(prompt)
    parsed_response = safe_json_parse(response_text)
    return {
        "idx": item["idx"],
        "personality": item["personality"],
        "query": item["query"],
        "parsed_response": parsed_response if parsed_response else None,
        "raw_response": response_text
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

        batch_results = [process_item(item) for item in batch]
        results.extend(batch_results)

        if lote_actual % SAVE_EVERY_N_BATCHES == 0:
            append_results(results, OUTPUT_PATH)
            processed_indices.update([r["idx"] for r in results])
            print(f"💾 Resultados guardados parcialmente "
                  f"({len(processed_indices)} acumulados).")
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
    print(f"🎯 Este PC procesará los IDs del {ID_INICIO} al {ID_FIN} "
          f"({len(IDS_A_PROCESAR)} ítems posibles).")

    existing_results, processed_indices = load_existing_results(OUTPUT_PATH)
    print(f"🔁 Reanudando desde el ítem {len(processed_indices)} procesado previamente.")

    process_in_batches(dataset, BATCH_SIZE, processed_indices)

