from sentence_transformers import util
import torch
from .image import extract_image_features, compare_image_embeddings

# Comparaison texte
def compare_documents(sub_embeddings, ref_embeddings, sub_sentences=None, ref_sentences=None, doc_type="text", threshold=0.75):
    results = []

    if doc_type == "text":
        for i, emb in enumerate(sub_embeddings):
            sims = util.cos_sim(emb, ref_embeddings)[0]
            max_score = torch.max(sims).item()
            best_idx = torch.argmax(sims).item()
            if max_score >= threshold:
                results.append({
                    "type": "text",
                    "sentence": sub_sentences[i],
                    "similarity": round(max_score, 2),
                    "matched_with": ref_sentences[best_idx]
                })
    elif doc_type == "image":
        match, score = compare_images(sub_embeddings, ref_embeddings, threshold)
        if match:
            results.append({
                "type": "image",
                "file": ref_sentences,  # ici ref_sentences = nom du fichier image
                "similarity": round(score, 2)
            })
    return results
