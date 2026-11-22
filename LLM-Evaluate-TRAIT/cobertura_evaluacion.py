"""Muestra los escenarios procesados y la cobertura por modelo y dimensión.

Uso desde la raíz del repositorio:
    python LLM-Evaluate-TRAIT/cobertura_evaluacion.py

Se cuentan escenarios únicos por su índice. Para gpt-oss se utiliza
específicamente gpt-oss/results_gpt-oss.json.
"""

import json
from pathlib import Path

ESCENARIOS_POR_DIMENSION = 1000

DIMENSIONES = (
    ("Openness", "Apertura"),
    ("Conscientiousness", "Responsabilidad"),
    ("Extraversion", "Extraversión"),
    ("Agreeableness", "Amabilidad"),
    ("Neuroticism", "Neuroticismo"),
    ("Machiavellianism", "Maquiavelismo"),
    ("Narcissism", "Narcisismo"),
    ("Psychopathy", "Psicopatía"),
)

ARCHIVOS_MODELOS = (
    ("deepseek-r1", Path("deepseek-r1/results_deepseek-r1.json")),
    ("gemma3", Path("gemma3/resultsGemma3_4b.json")),
    ("gpt-oss", Path("gpt-oss/all_results_gpt-oss.json")),
    ("llama3.1", Path("llama3.1/results_llama3.1.json")),
    ("mistral", Path("mistral/results_Mistral7b.json")),
)


def contar_escenarios(ruta):
    with ruta.open("r", encoding="utf-8") as archivo:
        registros = json.load(archivo)

    if not isinstance(registros, list):
        raise ValueError(f"Se esperaba una lista de registros en {ruta}")

    escenarios = {dimension: set() for dimension, _ in DIMENSIONES}
    for numero_registro, registro in enumerate(registros, start=1):
        if not isinstance(registro, dict):
            raise ValueError(f"Registro {numero_registro} inválido en {ruta}: se esperaba un objeto")

        dimension = registro.get("personality")
        indice = registro.get("idx")
        if dimension not in escenarios:
            raise ValueError(
                f"Dimensión desconocida en {ruta}, registro {numero_registro}: {dimension!r}"
            )
        if isinstance(indice, bool) or not isinstance(indice, int):
            raise ValueError(
                f"Índice inválido en {ruta}, registro {numero_registro}: {indice!r}"
            )

        escenarios[dimension].add(indice)

    return {dimension: len(indices) for dimension, indices in escenarios.items()}


def main():
    directorio = Path(__file__).resolve().parent
    resultados = []

    for modelo, archivo_relativo in ARCHIVOS_MODELOS:
        ruta = directorio / archivo_relativo
        conteos = contar_escenarios(ruta)
        resultados.extend(
            (modelo, nombre_es, conteos[nombre_dato])
            for nombre_dato, nombre_es in DIMENSIONES
        )

    print(f"Cobertura de la evaluación experimental (base: {ESCENARIOS_POR_DIMENSION} escenarios por dimensión)")
    print(f"{'Modelo':<14} {'Dimensión':<20} {'Procesados':>10} {'Faltantes':>10} {'Cobertura':>11}")
    print("-" * 70)

    incompletos = []
    for modelo, dimension, procesados in resultados:
        faltantes = max(0, ESCENARIOS_POR_DIMENSION - procesados)
        cobertura = procesados / ESCENARIOS_POR_DIMENSION * 100
        print(
            f"{modelo:<14} {dimension:<20} {procesados:>10} "
            f"{faltantes:>10} {cobertura:>10.1f}%"
        )
        if procesados < ESCENARIOS_POR_DIMENSION:
            incompletos.append((modelo, dimension, procesados, faltantes, cobertura))

    print("\nDimensiones con registros faltantes:")
    if not incompletos:
        print("Ninguna; todos los modelos tienen cobertura completa.")
        return

    for modelo, dimension, procesados, faltantes, cobertura in incompletos:
        print(
            f"- {modelo} / {dimension}: {procesados}/{ESCENARIOS_POR_DIMENSION} "
            f"procesados, {faltantes} faltantes ({cobertura:.1f}%)."
        )


if __name__ == "__main__":
    main()
