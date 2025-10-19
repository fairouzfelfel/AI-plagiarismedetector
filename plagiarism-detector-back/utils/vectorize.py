from sentence_transformers import SentenceTransformer

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

def embed_sentences(sentences):
    return model.encode(sentences, convert_to_tensor=True)
