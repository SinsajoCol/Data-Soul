"""
Análisis de sensibilidad de la transformación lineal S = a + b*p (Sección IV-E2 del artículo).

Recalcula la distancia euclidiana (Ec. 8) entre el perfil medio del grupo poblacional y el
perfil de cada LLM con dos transformaciones de la proporción p de respuestas "alto":
  - S = 1.8 + 2.4p  (la usada por Data-Soul, rango 1.8–4.2)
  - S = 1   + 4p    (alternativa que ocupa el rango completo 1–5 de la escala Likert)
e informa si cambia el orden (ranking) de los modelos.

Como las medias del grupo se reportan redondeadas a dos decimales (Tabla VIII), también
comprueba que el ranking no cambie al mover cada media ±0.005.

Uso:
    python analisis_sensibilidad.py [ruta/a/llm_raw.json]
"""
import itertools
import json
import math
import os
import sys

DIMENSIONES = ["Apertura", "Responsabilidad", "Extraversión", "Amabilidad",
               "Neuroticismo", "Maquiavelismo", "Narcisismo", "Psicopatía"]

# Medias del grupo poblacional (n = 31) por dimensión, Tabla VIII del artículo.
# Los datos individuales no se publican en el repositorio por tratarse de datos de participantes.
MEDIAS_GRUPO = [3.40, 3.38, 3.01, 3.56, 2.65, 2.92, 2.92, 2.28]

NOMBRES = {"DeepSeek-r1": "DeepSeek-R1:8b", "Mistral-7b": "Mistral:7b", "ChatGPT": "GPT-OSS:20b",
           "Gemma-3": "Gemma3:4b", "Llama-3.1": "LLaMA3.1:8b"}

TRANSFORMACIONES = {"S = 1.8 + 2.4p": (1.8, 2.4), "S = 1 + 4p": (1.0, 4.0)}


def proporciones(datos):
    """Proporción de respuestas 'alto' por dimensión para cada modelo."""
    return {modelo: [d[dim]["alto"] / (d[dim]["alto"] + d[dim]["bajo"]) for dim in DIMENSIONES]
            for modelo, d in datos.items()}


def distancias(props, medias, a, b):
    return {m: math.dist(medias, [a + b * p for p in ps]) for m, ps in props.items()}


def ranking(dist):
    return sorted(dist, key=dist.get)


def main():
    ruta = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "src", "data", "llm_raw.json")
    with open(ruta, encoding="utf-8") as f:
        props = proporciones(json.load(f))

    resultados = {t: distancias(props, MEDIAS_GRUPO, a, b) for t, (a, b) in TRANSFORMACIONES.items()}
    base = ranking(resultados["S = 1.8 + 2.4p"])

    print(f"{'Modelo':<16}" + "".join(f"{t:>18}" for t in TRANSFORMACIONES))
    for m in base:
        print(f"{NOMBRES.get(m, m):<16}" + "".join(f"{resultados[t][m]:>18.2f}" for t in TRANSFORMACIONES))

    for t in TRANSFORMACIONES:
        print(f"\nRanking con {t}: " + " < ".join(NOMBRES.get(m, m) for m in ranking(resultados[t])))
    iguales = len({tuple(ranking(r)) for r in resultados.values()}) == 1
    print(f"\n¿El orden de los modelos es el mismo con ambas transformaciones? {'Sí' if iguales else 'No'}")

    # Robustez frente al redondeo de las medias del grupo (±0.005 en cada dimensión)
    cambios = 0
    for signos in itertools.product((-0.005, 0.005), repeat=len(MEDIAS_GRUPO)):
        medias = [x + s for x, s in zip(MEDIAS_GRUPO, signos)]
        for a, b in TRANSFORMACIONES.values():
            cambios += ranking(distancias(props, medias, a, b)) != base
    total = 2 ** len(MEDIAS_GRUPO) * len(TRANSFORMACIONES)
    print(f"Combinaciones de redondeo (±0.005) en las que cambia el orden: {cambios} de {total}")


if __name__ == "__main__":
    main()
