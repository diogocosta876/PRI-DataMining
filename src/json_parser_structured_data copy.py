import pandas as pd
import json


df = pd.read_excel("data/processed_medication_data.xlsx")

json_data = df.to_json(orient="records")

pretty_json = json.dumps(json_data, indent=4)

# Save the JSON to a file
with open("data/processed_medication_data.json", "w") as file:
    file.write(json_data)

print("Conversion complete. JSON saved as 'processed_medication_data.json'")
