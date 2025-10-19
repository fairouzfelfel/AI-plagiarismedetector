import os
import pickle
from utils.extract import extract_text_and_images_from_pdf
from utils.image import extract_image_features  # Nous utilisons directement cette fonction

# --- Dossiers ---
REFERENCE_DIR = "reference_docs"
OUTPUT_DIR = "reference_embeddings"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def embed_images(images):
    """
    Prend une liste d'images (objets PIL.Image ou chemins) et renvoie leurs embeddings.
    """
    embeddings = []
    for img in images:
        emb = extract_image_features(img)
        embeddings.append(emb)
    return embeddings

# --- Boucle sur les fichiers de référence ---
for ref_file in os.listdir(REFERENCE_DIR):
    if not ref_file.lower().endswith((".pdf", ".png", ".jpg", ".jpeg")):
        continue

    ref_path = os.path.join(REFERENCE_DIR, ref_file)
    print(f"🔹 Traitement de : {ref_file}")

    # --- Extraire images selon le type de fichier ---
    if ref_file.lower().endswith(".pdf"):
        _, images = extract_text_and_images_from_pdf(ref_path)
    else:
        images = [ref_path]  # image seule

    if images:
        embeddings = embed_images(images)
        out_path = os.path.join(OUTPUT_DIR, ref_file + ".pkl")
        with open(out_path, "wb") as f:
            pickle.dump(embeddings, f)
        print(f"✅ Embeddings sauvegardés : {out_path}")
    else:
        print("⚠️ Aucune image trouvée pour ce fichier.")

print("\n🎉 Prétraitement terminé ! Les embeddings sont prêts.")
