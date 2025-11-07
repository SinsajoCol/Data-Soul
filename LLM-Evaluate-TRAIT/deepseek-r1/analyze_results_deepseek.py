import json
from collections import defaultdict
import os

input_filename = "results_deepseek.json"
output_filename = "ResultadosModelos.json"
model_name = "Gemma-3"

# Leer datos de entrada
with open(input_filename, "r", encoding="utf-8") as f:
    data = json.load(f)

# Contar altos y bajos
trait_counts = defaultdict(lambda: {"alto": 0, "bajo": 0})
for item in data:
    trait = item["personality"]
    response_type = item.get("type", "").lower()
    if "high" in response_type:
        trait_counts[trait]["alto"] += 1
    elif "low" in response_type:
        trait_counts[trait]["bajo"] += 1

# Cargar archivo existente (si ya tiene otros modelos)
if os.path.exists(output_filename):
    with open(output_filename, "r", encoding="utf-8") as f:
        final_result = json.load(f)
else:
    final_result = {}

# Agregar o actualizar el modelo actual
final_result[model_name] = dict(trait_counts)

# Guardar con formato compacto
with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(final_result, f, ensure_ascii=False, separators=(",", ": "))

print(f"\n✅ Archivo actualizado: {output_filename}")
print(f"✅ Modelo agregado: {model_name}")

