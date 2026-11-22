"""Muestra la cobertura y valida la estructura de los resultados por modelo.

Uso desde la raíz del repositorio:
    python LLM-Evaluate-TRAIT/cobertura_evaluacion.py

La validez comprobada es estructural; no determina si el contenido de una
respuesta es semánticamente correcto.
"""

from collections import defaultdict
import json
from pathlib import Path

ESCENARIOS_POR_DIMENSION = 1000
TIPOS_VALIDOS = {"response_high", "response_low"}

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

    orden_dimensiones = {
        nombre_dato: posicion
        for posicion, (nombre_dato, _) in enumerate(DIMENSIONES)
    }
    escenarios = {dimension: set() for dimension, _ in DIMENSIONES}
    registros_por_escenario = defaultdict(list)
    incidencias = {
        "registros_no_objeto": 0,
        "dimension_desconocida": 0,
        "indice_invalido": 0,
        "indice_fuera_de_dimension": 0,
        "duplicados": 0,
        "respuesta_vacia": 0,
        "explicacion_vacia": 0,
        "tipo_invalido": 0,
    }

    for numero_registro, registro in enumerate(registros, start=1):
        if not isinstance(registro, dict):
            incidencias["registros_no_objeto"] += 1
            continue

        dimension = registro.get("personality")
        indice = registro.get("idx")
        if not isinstance(dimension, str) or dimension not in escenarios:
            incidencias["dimension_desconocida"] += 1
            continue
        if isinstance(indice, bool) or not isinstance(indice, int):
            incidencias["indice_invalido"] += 1
            continue

        inicio = orden_dimensiones[dimension] * ESCENARIOS_POR_DIMENSION
        if not inicio <= indice < inicio + ESCENARIOS_POR_DIMENSION:
            incidencias["indice_fuera_de_dimension"] += 1
            continue

        escenarios[dimension].add(indice)
        registros_por_escenario[(dimension, indice)].append(registro)

    completos = {dimension: set() for dimension, _ in DIMENSIONES}
    validos = {dimension: set() for dimension, _ in DIMENSIONES}

    for (dimension, indice), filas in registros_por_escenario.items():
        if len(filas) > 1:
            incidencias["duplicados"] += len(filas) - 1
            continue

        registro = filas[0]
        respuesta = registro.get("response")
        explicacion = registro.get("explanation")
        tipo = registro.get("type")
        respuesta_ok = isinstance(respuesta, str) and bool(respuesta.strip())
        explicacion_ok = isinstance(explicacion, str) and bool(explicacion.strip())
        tipo_texto_ok = isinstance(tipo, str) and bool(tipo.strip())

        if not respuesta_ok:
            incidencias["respuesta_vacia"] += 1
        if not explicacion_ok:
            incidencias["explicacion_vacia"] += 1
        tipo_valido = isinstance(tipo, str) and tipo in TIPOS_VALIDOS
        if not tipo_valido:
            incidencias["tipo_invalido"] += 1

        if respuesta_ok and explicacion_ok and tipo_texto_ok:
            completos[dimension].add(indice)
        if respuesta_ok and explicacion_ok and tipo_valido:
            validos[dimension].add(indice)

    return escenarios, completos, validos, incidencias


def main():
    directorio = Path(__file__).resolve().parent
    resultados = []
    incidencias_por_modelo = {}

    for modelo, archivo_relativo in ARCHIVOS_MODELOS:
        ruta = directorio / archivo_relativo
        escenarios, completos, validos, incidencias = contar_escenarios(ruta)
        incidencias_por_modelo[modelo] = incidencias
        resultados.extend(
            (
                modelo,
                nombre_es,
                len(escenarios[nombre_dato]),
                len(completos[nombre_dato]),
                len(validos[nombre_dato]),
            )
            for nombre_dato, nombre_es in DIMENSIONES
        )

    print(
        "Cobertura experimental y validación estructural "
        f"(base: {ESCENARIOS_POR_DIMENSION} escenarios por dimensión)"
    )
    print(
        "Completo: response, explanation y type no vacíos. "
        "Válido estructural: completo, type reconocido, índice asignado a su dimensión "
        "y sin duplicados. No se evalúa la corrección semántica."
    )
    print(
        f"{'Modelo':<14} {'Dimensión':<20} {'Registrados':>11} "
        f"{'Completos':>10} {'Válidos estr.':>13} {'No válidos':>11} "
        f"{'Sin registro':>12} {'Cobertura válida':>17}"
    )
    print("-" * 114)

    incompletos = []
    for modelo, dimension, registrados, completos, validos in resultados:
        faltantes = ESCENARIOS_POR_DIMENSION - registrados
        no_validos = registrados - validos
        cobertura_valida = validos / ESCENARIOS_POR_DIMENSION * 100
        print(
            f"{modelo:<14} {dimension:<20} {registrados:>11} "
            f"{completos:>10} {validos:>13} {no_validos:>11} {faltantes:>12} "
            f"{cobertura_valida:>16.1f}%"
        )
        if validos < ESCENARIOS_POR_DIMENSION:
            incompletos.append(
                (modelo, dimension, validos, no_validos, faltantes, cobertura_valida)
            )

    print("\nDimensiones con cobertura válida incompleta:")
    if not incompletos:
        print("Ninguna; todos los modelos tienen cobertura completa.")
    for modelo, dimension, validos, no_validos, faltantes, cobertura in incompletos:
        texto_no_validos = (
            "1 registro no válido"
            if no_validos == 1
            else f"{no_validos} registros no válidos"
        )
        print(
            f"- {modelo} / {dimension}: {validos}/{ESCENARIOS_POR_DIMENSION} "
            f"válidos estructuralmente, {texto_no_validos} y "
            f"{faltantes} sin registro ({cobertura:.1f}% de cobertura válida)."
        )

    print("\nIncidencias estructurales por modelo:")
    for modelo, incidencias in incidencias_por_modelo.items():
        total = sum(incidencias.values())
        if total == 0:
            print(f"- {modelo}: ninguna.")
            continue
        detalle = ", ".join(
            f"{nombre}={cantidad}"
            for nombre, cantidad in incidencias.items()
            if cantidad
        )
        print(f"- {modelo}: {detalle}.")


if __name__ == "__main__":
    main()
