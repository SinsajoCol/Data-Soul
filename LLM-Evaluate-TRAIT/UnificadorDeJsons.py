import os
import json

def unify_json_files():
    # Cambia 'ResultadosModelos' por el nombre exacto del archivo que quieres unificar (sin .json)
    target_file_name = 'ResultadosModelos'  # <-- Coloca aquí el nombre del archivo
    
    # Obtener el directorio actual donde está el script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Lista para recopilar datos de JSONs con el nombre especificado
    unified_data = []
    
    # Recorrer las subcarpetas del directorio actual
    for subdir in os.listdir(current_dir):
        subdir_path = os.path.join(current_dir, subdir)
        if os.path.isdir(subdir_path):
            # Buscar el archivo específico en la subcarpeta
            file_path = os.path.join(subdir_path, f"{target_file_name}.json")
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    # Asumir que los JSONs son listas y concatenarlas
                    # Si son diccionarios, puedes cambiar a fusionar con update
                    if isinstance(data, list):
                        unified_data.extend(data)
                    else:
                        # Si no es lista, tratar como diccionario y fusionar
                        if not unified_data:
                            unified_data = data
                        else:
                            unified_data.update(data)
                except (json.JSONDecodeError, FileNotFoundError) as e:
                    print(f"Error al procesar {file_path}: {e}")
    
    # Crear archivo unificado en el directorio actual
    if unified_data:
        output_path = os.path.join(current_dir, f"{target_file_name}_unificado.json")
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(unified_data, f, indent=4, ensure_ascii=False)
            print(f"Archivo unificado creado: {output_path}")
        except Exception as e:
            print(f"Error al guardar {output_path}: {e}")
    else:
        print(f"No se encontraron archivos JSON con el nombre '{target_file_name}' en las subcarpetas.")

if __name__ == "__main__":
    unify_json_files()
