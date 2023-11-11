import pandas as pd
import json

df = pd.read_excel("data/processed_medication_data.xlsx")

json_data = df.to_json(orient="records")

# Convert the JSON string back to a Python object (list of dictionaries) for pretty formatting
json_object = json.loads(json_data)

pretty_json = json.dumps(json_object, indent=4, ensure_ascii=False)

# Save the pretty formatted JSON to a file with UTF-8 encoding
with open("indexing/processed_medication_data.json", "w", encoding="utf-8") as file:
    file.write(pretty_json)

print("Conversion complete. JSON saved as 'processed_medication_data.json'")