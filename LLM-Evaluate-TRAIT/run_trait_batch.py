import json
import subprocess
import time
from pathlib import Path

# ==============================
# CONFIGURACIÓN
# ==============================
MODEL_NAME = "llama3.2"
DATASET_PATH = "TRAIT.json"   # Ruta de tu dataset TRAIT
OUTPUT_PATH = "results_trait.json"
BATCH_SIZE = 10
SAVE_EVERY_N_BATCHES = 1

# ==============================
# FUNCIONES BASE
# ==============================
def run_ollama(prompt: str) -> str:
    """Ejecuta un prompt en el modelo local de Ollama y devuelve la salida limpia."""
    try:
        result = subprocess.run(
            ["ollama", "run", MODEL_NAME],
            input=prompt.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=120
        )
        output = result.stdout.decode("utf-8", errors="ignore").strip()
        return output
    except Exception as e:
        return f"ERROR: {e}"

# ==============================
# CONSTRUCCIÓN DEL PROMPT
# ==============================
def build_prompt(item: dict) -> str:
    """Combina statement, situation y query en un prompt estructurado."""
    return f"""
You are an AI psychologist trained to analyze personality traits.

The personality trait in focus is: **{item["personality"]}**

Statement:
"{item["statement"]}"

Situation:
"{item["situation"]}"

Question:
"{item["query"]}"

Possible responses:
A) {item["response_high1"]}
B) {item["response_high2"]}
C) {item["response_low1"]}
D) {item["response_low2"]}

Your task:
- Estimate the probability (0-1) that a person high in {item["personality"]} would choose each response.
- Return a JSON object strictly in this format:

{{
  "A": <probability>,
  "B": <probability>,
  "C": <probability>,
  "D": <probability>,
  "explanation": "Short explanation of reasoning."
}}
"""

# ==============================
# PROCESAMIENTO INDIVIDUAL
# ==============================
def process_item(item):
    prompt = build_prompt(item)
    response = run_ollama(prompt)
    return {
        "idx": item["idx"],
        "personality": item["personality"],
        "query": item["query"],
        "model_response": response
    }

# ==============================
# PROCESAMIENTO POR LOTES
# ==============================
def process_in_batches(dataset, batch_size):
    results = []
    total = len(dataset)
    for i in range(0, total, batch_size):
        batch = dataset[i:i + batch_size]
        print(f"\n🔹 Procesando lote {i//batch_size + 1} ({i + 1}-{min(i + batch_size, total)} de {total})")

        batch_results = [process_item(item) for item in batch]
        results.extend(batch_results)

        # Guardar cada N lotes
        if (i // batch_size + 1) % SAVE_EVERY_N_BATCHES == 0:
            save_partial_results(results, OUTPUT_PATH)
            print(f"💾 Resultados guardados parcialmente ({len(results)} registros).")

        time.sleep(1)

    save_partial_results(results, OUTPUT_PATH)
    print(f"\n✅ Procesamiento completado. {len(results)} respuestas guardadas.")
    return results

def save_partial_results(results, path):
    Path(path).write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")

# ==============================
# EJECUCIÓN PRINCIPAL
# ==============================
if __name__ == "__main__":
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        dataset = json.load(f)
    print(f"✅ Dataset cargado con {len(dataset)} ítems.")
    results = process_in_batches(dataset, BATCH_SIZE)
