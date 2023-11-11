import os
import json

def load_structured_data(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

def combine_data(structured_data, unstructured_dir):
    for filename in os.listdir(unstructured_dir):
        if filename.endswith('.json'):
            product_name = os.path.splitext(filename)[0]

            with open(os.path.join(unstructured_dir, filename), 'r', encoding='utf-8') as file:
                unstructured_json = json.load(file)

            structured_entry = next((item for item in structured_data if item['Product name'] == product_name), None)

            if structured_entry:
                combined_data = {**structured_entry, **unstructured_json}

                with open(os.path.join(unstructured_dir, filename), 'w', encoding='utf-8') as file:
                    json.dump(combined_data, file, indent=4, ensure_ascii=False)

def combine_all_into_one(unstructured_dir, combined_filename):
    all_data = []
    for filename in os.listdir(unstructured_dir):
        if filename.endswith('.json'):
            with open(os.path.join(unstructured_dir, filename), 'r', encoding='utf-8') as file:
                data = json.load(file)
                all_data.append(data)

    with open(combined_filename, 'w', encoding='utf-8') as file:
        json.dump(all_data, file, indent=4, ensure_ascii=False)

# Load the data
structured_data = load_structured_data('data/structured_data.json')
unstructured_data_dir = 'unstructured_data/'

# Combine individual JSON data with structured data
combine_data(structured_data, unstructured_data_dir)

# Combine all JSON files into one
combined_json_filename = 'indexing/combined_medication_data.json'
combine_all_into_one(unstructured_data_dir, combined_json_filename)
