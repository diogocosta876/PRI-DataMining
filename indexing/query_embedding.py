import requests
from sentence_transformers import SentenceTransformer

def text_to_embedding(text):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode(text, convert_to_tensor=False).tolist()
    
    # Convert the embedding to the expected format
    embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    return embedding_str

def solr_knn_query(endpoint, collection, embedding):
    url = f"{endpoint}/{collection}/select"

    data = {
        "q": f"{{!knn f=vector topK=10}}{embedding}",
        "fl": "Antes_de_utilizar,O_que_e_e_para_que_e_utilizado,Vias_de_Administracao,Duracao_do_Tratamento,Generico,Product_name,Substancia_Ativa_DCI",
        "rows": 10,
        "wt": "json"
    }
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    #Pedido para o Solr
    response = requests.post(url, data=data, headers=headers)
    response.raise_for_status()
    return response.json()

def display_results(results):
    docs = results.get("response", {}).get("docs", [])
    if not docs:
        print("No results found.")
        return

    # Display do que quero dos resultados
    for doc in docs:
        print(f"* {doc.get('Product_name')}")

def main():
    solr_endpoint = "http://localhost:8983/solr"
    collection = "medicines"
    
    query_text = input("Enter your query: ")
    embedding = text_to_embedding(query_text)
    print(f"Query embedding: {embedding}")

    try:
        results = solr_knn_query(solr_endpoint, collection, embedding)
        display_results(results)
    except requests.HTTPError as e:
        print(f"Error {e.response.status_code}: {e.response.text}")

if __name__ == "__main__":
    main()
