from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer("all-MiniLM-L6-v2")


@app.route("/generate_embedding", methods=["POST"])
def generate_embedding():
    text = request.json.get("text")
    embedding = model.encode(text, convert_to_tensor=False).tolist()
    return jsonify(embedding)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5600)
