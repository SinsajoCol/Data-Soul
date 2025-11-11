import os
import json

def unify_json_files():
    # Nombre del archivo que se busca dentro de las subcarpetas
    target_file_name = 'ResultadosModelos'  # sin extensión
    current_dir = os.path.dirname(os.path.abspath(__file__))
    unified_data = {}

    # Recorrer las subcarpetas
    for subdir in os.listdir(current_dir):
        subdir_path = os.path.join(current_dir, subdir)
        if os.path.isdir(subdir_path):
            file_path = os.path.join(subdir_path, f"{target_file_name}.json")
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    if isinstance(data, dict):
                        unified_data.update(data)
                except (json.JSONDecodeError, FileNotFoundError) as e:
                    print(f"⚠️ Error al procesar {file_path}: {e}")

    # ==========================================================
    # === GENERAR ARCHIVO UNIFICADO CON FORMATO LEGIBLE ===
    # ==========================================================
    if unified_data:
        output_path = os.path.join(current_dir, f"{target_file_name}_unificado.json")

        formatted_json = "{\n"
        for i, (model, traits) in enumerate(unified_data.items()):
            formatted_json += f'  "{model}": {{\n'
            for j, (trait, counts) in enumerate(traits.items()):
                formatted_json += f'    "{trait}": {json.dumps(counts, ensure_ascii=False)},\n'
            formatted_json = formatted_json.rstrip(",\n") + "\n  }"
            if i < len(unified_data) - 1:
                formatted_json += ",\n"
        formatted_json += "\n}\n"

        try:
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(formatted_json)
            print(f"\n✅ Archivo unificado creado con formato legible: {output_path}")
        except Exception as e:
            print(f"❌ Error al guardar {output_path}: {e}")
    else:
        print(f"⚠️ No se encontraron archivos '{target_file_name}.json' en las subcarpetas.")

if __name__ == "__main__":
    unify_json_files()
