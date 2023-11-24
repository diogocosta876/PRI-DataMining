import os
import json

def load_structured_data(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)


finalJson = []

#Search leaflet with "Product name" or "Active substance" or "Substância Ativa/DCI" 
def search_leaflet(structured_data, unstructured_data_dir):

    files_in_directory = os.listdir(unstructured_data_dir)

    #i = 0 #test code
    for medicine in structured_data:
        #if(i==3): break #test code

        productName = medicine["Product name"] + ".json"
        if(medicine["Substância Ativa/DCI"]):
            activeSubstancePT = medicine["Substância Ativa/DCI"] + ".json"
        else:
            activeSubstancePT = "error"
        activeSubstance = medicine["Active substance"] + ".json"

        # Check if the file exists in the directory
        if productName in files_in_directory:
            file_path = os.path.join(unstructured_data_dir, productName)
        elif activeSubstancePT in files_in_directory:
            file_path = os.path.join(unstructured_data_dir, activeSubstancePT)
        elif activeSubstance in files_in_directory:
            file_path = os.path.join(unstructured_data_dir, activeSubstance)
        else:
            print(f":( The leaflet for'{productName}' was not found.")
            finalJson.append(medicine)
            continue


        # Open the file
        with open(file_path, 'r', encoding='utf-8') as file:
            unstructured_json = json.load(file)
        
        combined_data = {**medicine, **unstructured_json}
        finalJson.append(combined_data)

        print(f"'{productName}' leaflet found and added.")

        #i += 1 #test code

    with open("indexing/combined_medication_data.json", 'w', encoding='utf-8') as file:
        json.dump(finalJson, file, indent=4, ensure_ascii=False)

#RUN -------

# Load the data
structured_data = load_structured_data('data/structured_data.json')
unstructured_data_dir = 'unstructured_data/'

search_leaflet(structured_data, unstructured_data_dir)

