import json
import os
import re
import sys

# Une los archivos parciales de gpt-oss en uno solo, sin duplicados.
# Uso: python consolidate_results.py [carpeta] [archivo_salida]

PATRON = re.compile(r"^results_gpt-oss(-\d+|\(\d+\))?\.json$")


def consolidate_json_files(directory, output_filename):
    por_idx = {}
    leidas = 0
    repetidas = 0

    for filename in sorted(os.listdir(directory)):
        if not PATRON.match(filename):
            continue
        with open(os.path.join(directory, filename), "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            print(f"{filename}: omitido (no es una lista)")
            continue
        print(f"{filename}: {len(data)} items")
        for item in data:
            leidas += 1
            if item["idx"] in por_idx:
                repetidas += 1  # mismo idx en otro archivo: se conserva el primero
            else:
                por_idx[item["idx"]] = item

    consolidated = [por_idx[k] for k in sorted(por_idx)]
    out_path = os.path.join(directory, output_filename)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(consolidated, f, indent=4, ensure_ascii=False)

    faltantes = sorted(set(range(8000)) - set(por_idx))
    print(f"\nFilas leidas: {leidas} | repetidas descartadas: {repetidas}")
    print(f"Items unicos: {len(consolidated)} | sin respuesta: {len(faltantes)}")
    print(f"Archivo generado: {out_path}")


if __name__ == "__main__":
    carpeta = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
    salida = sys.argv[2] if len(sys.argv) > 2 else "all_results_gpt-oss.json"
    consolidate_json_files(carpeta, salida)
