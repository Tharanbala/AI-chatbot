# import os
# import openai
# from dotenv import load_dotenv
# from pinecone import Pinecone

# load_dotenv()

# pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

# def get_embeddings(text):
#     response = openai.embeddings.create(
#         input=text,
#         model="text-embedding-ada-002"
#     )
#     embedding = response.data[0].embedding
#     return embedding

# def query_pinecone(query_embedding):
#     print("INSIDE QUERY UTIL")
#     index = pc.Index("uwm-helpdesk-kb")
#     query_result = index.query(
#         vector=query_embedding,
#         top_k=10,
#         include_metadata=True
#     )
#     return query_result
