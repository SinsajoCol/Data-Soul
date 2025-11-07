import json
from collections import defaultdict
import math

# ==========================================================
# === CONFIGURACIÓN INICIAL ===
# ==========================================================
# Se define el archivo de entrada (resultados del modelo) y de salida (archivo JSON final).
# Además, se asigna el nombre del modelo para que se muestre en los resultados.
input_filename = "resultsGemma3_4b.json"
output_filename = "ResultadosModelos.json"
model_name = "Gemma 3.4B"  # << Cambiar si analizas otro modelo >>

# ==========================================================
# === VALORES ASIGNADOS A LAS CATEGORÍAS ===
# ==========================================================
# Estos valores representan los puntajes numéricos asociados a cada tipo de respuesta.
# - HIGH  (alto) = 4.2  → Representa un rasgo alto
# - LOW   (bajo) = 1.8  → Representa un rasgo bajo
# - (Si existiera medio sería 3.0, pero en este caso solo hay high/low)
VALOR_HIGH = 4.2
VALOR_LOW = 1.8

# ==========================================================
# === LECTURA DEL ARCHIVO JSON DE RESULTADOS ===
# ==========================================================
# Se abre y carga el archivo JSON con las respuestas generadas por el modelo.
with open(input_filename, "r", encoding="utf-8") as f:
    data = json.load(f)

# ==========================================================
# === CONTADORES DE RESPUESTAS POR RASGO ===
# ==========================================================
# Creamos un diccionario que acumulará cuántas respuestas fueron "high" o "low"
# para cada rasgo de personalidad. Ejemplo:
# { "Openness": {"high": 520, "low": 480, "total": 1000}, ... }
trait_stats = defaultdict(lambda: {"high": 0, "low": 0, "total": 0})

# ==========================================================
# === PROCESAMIENTO DE CADA RESPUESTA ===
# ==========================================================
# Se recorre cada ítem del JSON (cada respuesta del modelo)
# y se clasifica según si fue tipo "high" o "low".
for item in data:
    trait = item["personality"]            # Nombre del rasgo (ej: Openness)
    response_type = item.get("type", "").lower()  # Tipo de respuesta ("high" o "low")

    # Contamos cuántas respuestas de cada tipo hay por rasgo
    if "high" in response_type:
        trait_stats[trait]["high"] += 1
    elif "low" in response_type:
        trait_stats[trait]["low"] += 1

    # Se suma 1 al total de respuestas del rasgo
    trait_stats[trait]["total"] += 1

# ==========================================================
# === IMPRESIÓN DE ENCABEZADO ===
# ==========================================================
print(f"\n{'='*80}")
print(f"=== PUNTAJE PROMEDIO Y DESVIACIÓN ESTÁNDAR — Modelo: {model_name} ===")
print(f"{'='*80}\n")

# Encabezado de tabla con las columnas formateadas
print(f"{'Rasgo':20} | {'High':>5} | {'Low':>5} | {'Total':>5} | {'Promedio':>9} | {'σ (Desv)':>8} | {'Nivel':>7}")
print("-" * 80)

# ==========================================================
# === CÁLCULO DEL PROMEDIO Y DESVIACIÓN ESTÁNDAR ===
# ==========================================================
# Se aplican las fórmulas estadísticas por rasgo.
# Promedio ponderado:
#     μ = ( (n_high * 4.2) + (n_low * 1.8) ) / total
#
# Varianza:
#     σ² = [ n_high*(4.2 - μ)² + n_low*(1.8 - μ)² ] / total
#
# Desviación estándar:
#     σ = sqrt(σ²)
#
# Clasificación según el promedio:
#     1.0 – 2.6 → Bajo
#     2.6 – 3.4 → Medio
#     3.4 – 5.0 → Alto

scores = {}  # Diccionario para guardar los resultados finales

for trait, stats in trait_stats.items():
    total = stats["total"]
    if total == 0:
        continue  # Evita división por cero

    high = stats["high"]
    low = stats["low"]

    # === PROMEDIO PONDERADO ===
    promedio = ((high * VALOR_HIGH) + (low * VALOR_LOW)) / total

    # === VARIANZA Y DESVIACIÓN ESTÁNDAR ===
    varianza = (
        (high * (VALOR_HIGH - promedio) ** 2) +
        (low * (VALOR_LOW - promedio) ** 2)
    ) / total
    desviacion = math.sqrt(varianza)

    # === CLASIFICACIÓN SEGÚN PROMEDIO ===
    if promedio < 2.6:
        nivel = "Bajo"
    elif promedio < 3.4:
        nivel = "Medio"
    else:
        nivel = "Alto"

    # === GUARDAR RESULTADOS ===
    scores[trait] = {
        "Promedio": round(promedio, 3),
        "Desviación": round(desviacion, 3),
        "Nivel": nivel
    }

    # === IMPRESIÓN FORMATEADA DE CADA RASGO ===
    print(f"{trait:20} | {high:5d} | {low:5d} | {total:5d} | "
          f"{promedio:9.3f} | {desviacion:8.3f} | {nivel:>7}")

# ==========================================================
# === RESUMEN FINAL ===
# ==========================================================
print(f"\n{'='*80}")
print("=== RESUMEN FINAL ===")
print(f"{'='*80}")

# Se imprimen los resultados de forma resumida
for trait, values in scores.items():
    print(f"{trait:20}: Promedio = {values['Promedio']:6.3f}, "
          f"σ = {values['Desviación']:6.3f}, Nivel = {values['Nivel']}")

# ==========================================================
# === GUARDADO EN JSON ===
# ==========================================================
# Se guarda el resultado final en formato JSON.
# Ejemplo del formato:
# {
#   "Llama3.1": {
#       "Openness": {"Promedio": 3.151, "Desviación": 1.190, "Nivel": "Medio"},
#       ...
#   }
# }
final_result = {model_name: scores}

with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(final_result, f, indent=2, ensure_ascii=False)

# ==========================================================
# === MENSAJE FINAL ===
# ==========================================================
print(f"\n✅ Archivo guardado como: {output_filename}")
print("✅ Análisis completado con éxito.")
