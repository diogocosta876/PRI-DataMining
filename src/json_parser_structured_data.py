from unidecode import unidecode
import pandas as pd
import json


def apply_to_column_name(name):
    name = name.strip()
    name = name.replace(" ", "_")
    name = unidecode(name)
    name = name.replace("/", "_")
    name = name.replace("(", "")
    name = name.replace(")", "")

    if(name[-1] == ':'):
        name = name[:-1]

    return name

df = pd.read_excel("data/processed_medication_data.xlsx")
df.columns = df.columns.to_series().apply(apply_to_column_name)
print(df.columns)


json_data = df.to_json(orient="records")

# Convert the JSON string back to a Python object (list of dictionaries) for pretty formatting
json_object = json.loads(json_data)

pretty_json = json.dumps(json_object, indent=4, ensure_ascii=False)

# Save the pretty formatted JSON to a file with UTF-8 encoding
with open("data/structured_data.json", "w", encoding="utf-8") as file:
    file.write(pretty_json)

print("Conversion complete. JSON saved as 'processed_medication_data.json'")