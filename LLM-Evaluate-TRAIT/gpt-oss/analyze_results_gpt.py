import json
from collections import defaultdict
from pathlib import Path

# ==========================================================
# === CONFIGURACIÓN ===
# ==========================================================
script_directory = Path(__file__).resolve().parent
input_filename = script_directory / "all_results_gpt-oss.json"
output_filename = script_directory / "ResultadosModelos.json"
model_name = "gpt-oss"

# ==========================================================
# === LECTURA DEL ARCHIVO DE ENTRADA ===
# ==========================================================
with input_filename.open("r", encoding="utf-8") as f:
    data = json.load(f)

# ==========================================================
# === CONTEO DE ALTOS Y BAJOS ===
# ==========================================================
trait_counts = defaultdict(lambda: {"alto": 0, "bajo": 0})
seen_indices = set()
duplicate_count = 0

for item in data:
    idx = item["idx"]
    if idx in seen_indices:
        duplicate_count += 1
        continue
    seen_indices.add(idx)

    trait = item["personality"]
    response_type = item.get("type", "").lower()
    if "high" in response_type:
        trait_counts[trait]["alto"] += 1
    elif "low" in response_type:
        trait_counts[trait]["bajo"] += 1

# ==========================================================
# === COMBINAR CON ARCHIVO EXISTENTE ===
# ==========================================================
if output_filename.exists():
    with output_filename.open("r", encoding="utf-8") as f:
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

with output_filename.open("w", encoding="utf-8") as f:
    f.write(formatted_json)

# ==========================================================
# === MENSAJE FINAL ===
# ==========================================================
print(f"\nArchivo actualizado: {output_filename}")
print(f"Modelo agregado: {model_name}")
print(f"Registros duplicados ignorados: {duplicate_count}")