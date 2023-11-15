import json
import random

def load_data(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)



def choose_data(oldData, numberitems):
    mandatory_files = ["Dancor", "Colroset", "Aspifox", "Claritromicina Azevedos"]

    mandatoryData = [item for item in oldData if item["Product_name"] in mandatory_files]
    ramdomData = [item for item in oldData if "O_que_e_e_para_que_e_utilizado" in item and item["Product_name"] not in mandatory_files]

    random_items = random.sample(oldData, numberitems - len(mandatoryData))

    randomJson = mandatoryData + random_items

    print(len(randomJson))

    with open("indexing/sample_combined_medication_data.json", 'w', encoding='utf-8') as file:
        json.dump(randomJson, file, indent=4, ensure_ascii=False)
    

data = load_data('indexing/combined_medication_data.json')


choose_data(data, 30)