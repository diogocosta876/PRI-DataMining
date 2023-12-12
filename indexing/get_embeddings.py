import sys
import json
from sentence_transformers import SentenceTransformer

# Load the SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text):
    # The model.encode() method already returns a list of floats
    return model.encode(text, convert_to_tensor=False).tolist()

if __name__ == "__main__":
    # Read JSON from STDIN
    data = json.load(sys.stdin)

    # Update each document in the JSON data
    for document in data:
        # Extract fields if they exist, otherwise default to empty strings
        Antes_de_utilizar = document.get("Antes_de_utilizar", "")
        O_que_e_e_para_que_e_utilizado = document.get("O_que_e_e_para_que_e_utilizado", "")
        Vias_de_Administracao = document.get("Vias_de_Administracao", "")
        Duracao_do_Tratamento = document.get("Duracao_do_Tratamento", "")
        Generico = document.get("Generico", "")
        Product_name = document.get("Product_name", "")
        Substancia_Ativa_DCI = document.get("Substancia_Ativa_DCI", "")

        combined_text = Antes_de_utilizar + " " + O_que_e_e_para_que_e_utilizado + " " + Vias_de_Administracao + " " + Duracao_do_Tratamento + " " + Generico + " " + Product_name + " " + Substancia_Ativa_DCI
        document["vector"] = get_embedding(combined_text)

    # Output updated JSON to STDOUT
    json.dump(data, sys.stdout, indent=4, ensure_ascii=False)
