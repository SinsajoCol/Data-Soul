import json
import os
import re

def consolidate_json_files(directory, output_filename):
    consolidated_data = []
    
    patterns = [
        re.compile(r"results_gpt-oss\(\d+\)\.json"),
        re.compile(r"results_gpt-oss-\d+\.json")
    ]

    for filename in os.listdir(directory):
        if any(p.match(filename) for p in patterns):
            path = os.path.join(directory, filename)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        consolidated_data.extend(data)
                        print(f"{filename}: {len(data)} items")
                    else:
                        print(f"{filename}: skipped (not a list)")
            except Exception as e:
                print(f"{filename}: error → {e}")

    # Ordenar por idx 
    consolidated_data.sort(key=lambda x: x.get("idx", 0))

    # Guardar archivo final
    out_path = os.path.join(directory, output_filename)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(consolidated_data, f, indent=4, ensure_ascii=False)

    print(f"\nOK — Total items: {len(consolidated_data)}")
    print(f"Archivo generado: {out_path}")

if __name__ == "__main__":
    target_directory = r"c:/Users/crist/Desktop/Data Soul/Data-Soul/LLM-Evaluate-TRAIT/gpt-oss"
    output_file = "all_results_gpt-oss.json"
    consolidate_json_files(target_directory, output_file)
