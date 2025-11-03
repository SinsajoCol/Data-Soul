import json
from collections import defaultdict

# === CONFIGURACIÓN ===
input_filename = "results_Mistral7b.json"
output_filename = "ResultadosModelos.json"
model_name = "Mistral7B"          # <<<<< Cambia aquí el nombre del modelo

# === LECTURA DEL ARCHIVO ===
with open(input_filename, "r", encoding="utf-8") as f:
    data = json.load(f)

# === CÁLCULO DE ESTADÍSTICAS ===
trait_stats = defaultdict(lambda: {"high": 0, "low": 0, "total": 0})

for item in data:
    trait = item["personality"]
    response_type = item.get("type", "").lower()

    if "high" in response_type:
        trait_stats[trait]["high"] += 1
    elif "low" in response_type:
        trait_stats[trait]["low"] += 1
    trait_stats[trait]["total"] += 1

# === CÁLCULO DE PUNTAJES (0–100) ===
print("\n=== PUNTAJE PROMEDIO POR RASGO (0–100) — Modelo:", model_name, "===\n")

scores = {}
for trait, stats in trait_stats.items():
    total = stats["total"]
    score = (stats["high"] / total) * 100 if total > 0 else 0
    scores[trait] = round(score, 2)

    print(f"{trait:20} | High: {stats['high']:3d} | Low: {stats['low']:3d} "
          f"| Total: {total:3d} | Score: {score:6.2f}")

# === GUARDADO EN JSON ===
final_result = {model_name: scores}

with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(final_result, f, indent=2, ensure_ascii=False)

# === RESUMEN FINAL ===
print("\n=== RESUMEN FINAL ===")
for trait, score in scores.items():
    print(f"{trait:20}: {score:6.2f}")

print(f"\nArchivo guardado: {output_filename}")
print("✅ Análisis completado con éxito.")