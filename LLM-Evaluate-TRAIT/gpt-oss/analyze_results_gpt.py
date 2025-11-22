import json
from collections import defaultdict
import os

# ==========================================================
# === CONFIGURACIÓN ===
# ==========================================================
input_filename = r"c:/Users/crist/Desktop/Data Soul/Data-Soul/LLM-Evaluate-TRAIT/gpt-oss/all_results_gpt-oss.json"

output_filename = r"c:/Users/crist/Desktop/Data Soul/Data-Soul/LLM-Evaluate-TRAIT/gpt-oss/ResultadosModelos.json"

model_name = "gpt-oss"

# ==========================================================
# === LECTURA DEL ARCHIVO DE ENTRADA ===
# ==========================================================
with open(input_filename, "r", encoding="utf-8") as f:
    data = json.load(f)

# ==========================================================
# === CONTEO DE ALTOS Y BAJOS ===
# ==========================================================
trait_counts = defaultdict(lambda: {"alto": 0, "bajo": 0})

for item in data:
    trait = item["personality"]
    response_type = item.get("type", "").lower()
    if "high" in response_type:
        trait_counts[trait]["alto"] += 1
    elif "low" in response_type:
        trait_counts[trait]["bajo"] += 1

# ==========================================================
# === COMBINAR CON ARCHIVO EXISTENTE ===
# ==========================================================
if os.path.exists(output_filename):
    with open(output_filename, "r", encoding="utf-8") as f:
        final_result = json.load(f)
else:
    final_result = {}

final_result[model_name] = dict(trait_counts)

# ==========================================================
# === GUARDADO CON FORMATO MIXTO ===
# ==========================================================
# Usamos indent=2 para los modelos, pero serializamos internamente
# los valores (alto/bajo) en una sola línea.
formatted_json = "{\n"
for i, (model, traits) in enumerate(final_result.items()):
    formatted_json += f'  "{model}": {{\n'
    for j, (trait, counts) in enumerate(traits.items()):
        formatted_json += f'    "{trait}": {json.dumps(counts, ensure_ascii=False)},\n'
    formatted_json = formatted_json.rstrip(",\n") + "\n  }"
    if i < len(final_result) - 1:
        formatted_json += ",\n"
formatted_json += "\n}\n"

with open(output_filename, "w", encoding="utf-8") as f:
    f.write(formatted_json)

# ==========================================================
# === MENSAJE FINAL ===
# ==========================================================
print(f"\n✅ Archivo actualizado: {output_filename}")
print(f"✅ Modelo agregado: {model_name}")