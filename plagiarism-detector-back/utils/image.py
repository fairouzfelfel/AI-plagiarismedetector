import torch
from torchvision import models, transforms
from PIL import Image
import numpy as np

# Charger ResNet50 pré-entraîné
resnet = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
resnet.eval()

# Transformation standard pour les images
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def extract_image_features(image):
    """
    Prend un objet PIL.Image ou un chemin et renvoie l'embedding ResNet.
    """
    if isinstance(image, str):  # chemin
        image = Image.open(image).convert("RGB")
    elif isinstance(image, Image.Image):
        image = image.convert("RGB")
    else:
        raise ValueError("image doit être un chemin ou un objet PIL.Image")

    img_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        features = resnet(img_tensor)
    return features.squeeze().numpy()

def compare_image_embeddings(embeddings1, embeddings2, images1, images2, threshold=0.75):
    """
    Compare deux listes d'embeddings d'images.
    embeddings1 = embeddings du document uploadé
    embeddings2 = embeddings des documents de référence
    """
    results = []
    for i, emb1 in enumerate(embeddings1):
        for j, emb2 in enumerate(embeddings2):
            sim = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
            if sim >= threshold:
                results.append({
                    "image": getattr(images1[i], "filename", f"image_{i}"),
                    "matched_with": getattr(images2[j], "filename", f"ref_image_{j}"),
                    "similarity": float(round(sim, 2))
                })
    return results
