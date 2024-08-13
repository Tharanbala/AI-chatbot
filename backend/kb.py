import os
import requests
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

def extract_kb_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    content = soup.get_text(strip=True)
    return content

def get_embeddings(text):
    response = openai.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    embedding = response.data[0].embedding
    return embedding

def prepare_pinecone():
    # Create the index if it doesn't exist
    if 'uwm-helpdesk-kb' not in pc.list_indexes().names():
        pc.create_index(
            name="uwm-helpdesk-kb",
            dimension=1536,  # Dimension of the embedding vectors, should match your embedding model's output
            metric="cosine",
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )

    index = pc.Index("uwm-helpdesk-kb")

    kb_links = [
        "https://kb.uwm.edu/uwmhd/page.php?id=63671"
    ]
    kb_contents = [(url, extract_kb_content(url)) for url in kb_links]
    kb_embeddings = [(url, get_embeddings(content)) for url, content in kb_contents]

    # Prepare the data for upsert
    vectors = [(url, embedding) for url, embedding in kb_embeddings]

    # Upsert the data into Pinecone
    index.upsert(vectors)

def query_pinecone(query_embedding):
    index = pc.Index("uwm-helpdesk-kb")
    query_result = index.query(
        vector=query_embedding,
        top_k=10
    )
    serialized_results = []
    for match in query_result['matches']:
        serialized_results.append({
            "id": match['id'],
            "score": match['score'],
            "metadata": match['metadata'] if 'metadata' in match else {},
            "values": match['values'] if 'values' in match else []
        })
    return serialized_results
