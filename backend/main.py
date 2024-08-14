from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from kb import prepare_pinecone, get_embeddings, query_pinecone
import json

load_dotenv()
prepare_pinecone()

app = Flask(__name__)
CORS(app)

# @app.route('/api/embed', methods=['POST'])
# def embed():
#     data = request.json
#     text = data.get('text')
#     embedding = get_embeddings(text)
#     return jsonify({"embedding": embedding})

@app.route('/api/query', methods=['POST'])
def query():
    data = request.json
    text = data.get('text')
    query_embedding = get_embeddings(text)
    results = query_pinecone(query_embedding)
    return jsonify(results)  

if __name__ == '__main__':
    app.run(debug=True)