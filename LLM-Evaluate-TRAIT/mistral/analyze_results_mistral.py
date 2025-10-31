import json
from collections import defaultdict

# === CONFIGURACIÓN ===
filename = "results_Mistral7b.json"

# === LECTURA DEL ARCHIVO ===
with open(filename, "r", encoding="utf-8") as f:
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
print("\n=== PUNTAJE PROMEDIO POR RASGO (0–100) — Modelo: Mistral 7b ===\n")

scores = {}

for trait, stats in trait_stats.items():
    total = stats["total"]
    if total == 0:
        score = 0
    else:
        score = (stats["high"] / total) * 100

    scores[trait] = round(score, 2)

    print(f"{trait:20} | High: {stats['high']:3d} | Low: {stats['low']:3d} | Total: {total:3d} | Score: {score:6.2f}")

# === RESUMEN FINAL ===
print("\n=== RESUMEN FINAL ===")
for trait, score in scores.items():
    print(f"{trait:20}: {score:6.2f}")

print("\n✅ Análisis completado con éxito.")
