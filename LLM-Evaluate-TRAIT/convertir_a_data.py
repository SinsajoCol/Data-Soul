import os
import json

def convert_results():
    # Rutas relativas
    current_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(current_dir, "ResultadosModelos_unificado.json")
    output_path = os.path.join(current_dir, "..", "src", "data", "ResultadosModelos_unificado.json")
    output_path = os.path.abspath(output_path)

    # Si no existe el unificado, intentar correr UnificadorDeJsons.py o avisar
    if not os.path.exists(input_path):
        print(f"No se encontro {input_path}. Intentando generarlo...")
        try:
            from UnificadorDeJsons import unify_json_files
            unify_json_files()
        except ImportError:
            print("No se pudo importar UnificadorDeJsons.py para generar el archivo.")
            return

    with open(input_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    # Mapeo de nombres de modelos para src/data
    model_mapping = {
        "deepseek-r1": "Deepseek",
        "Gemma-3": "Gemma 3.4B",
        "Llama-3.1": "Llama3.1",
        "Mistral-7b": "Mistral7B",
        "gpt-oss": "ChatGPT"
    }

    # Orden deseado de rasgos
    trait_order = [
        "Openness",
        "Conscientiousness",
        "Extraversion",
        "Agreeableness",
        "Neuroticism",
        "Machiavellianism",
        "Narcissism",
        "Psychopathy"
    ]

    converted_data = {}

    for raw_model_name, traits in raw_data.items():
        # Mapear el nombre del modelo o conservar el original si no está en el mapeo
        model_name = model_mapping.get(raw_model_name, raw_model_name)
        
        model_traits = {}
        for trait in trait_order:
            if trait in traits:
                counts = traits[trait]
                alto = counts.get("alto", 0)
                bajo = counts.get("bajo", 0)
                total = alto + bajo
                
                if total > 0:
                    # Calcular el porcentaje de respuestas 'alto'
                    percentage = (alto / total) * 100
                    # Redondear a 2 decimales si no es entero, o a 1 si es decimal simple
                    rounded = round(percentage, 2)
                    if rounded % 1 == 0:
                        rounded = int(rounded)
                    model_traits[trait] = rounded
                else:
                    model_traits[trait] = 0.0

        converted_data[model_name] = model_traits

    # Guardar el archivo convertido con formato legible
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(converted_data, f, indent=4, ensure_ascii=False)
        print(f"Conversion exitosa. Archivo guardado en: {output_path}")
    except Exception as e:
        print(f"Error al guardar el archivo convertido: {e}")

if __name__ == "__main__":
    convert_results()
