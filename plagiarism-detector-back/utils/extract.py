import os
import io
from PyPDF2 import PdfReader
from docx import Document
from PIL import Image
import fitz  # PyMuPDF

def extract_text_from_file(file_path):
    """
    Extrait le texte brut d'un fichier PDF, DOCX ou image.
    """
    ext = file_path.split('.')[-1].lower()

    if ext == 'pdf':
        reader = PdfReader(file_path)
        return "\n".join([page.extract_text() or "" for page in reader.pages])

    elif ext == 'docx':
        doc = Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])

    elif ext in ['png', 'jpg', 'jpeg']:
        # Pour les images seules, on retourne une chaîne vide (analyse d'image ailleurs)
        return ""

    else:
        return ""


def extract_text_and_images_from_pdf(file_path):
    """
    Extrait à la fois le texte et les images d’un fichier PDF.
    Retourne :
        - text : str
        - images : [PIL.Image]
    """
    text = ""
    images = []

    with fitz.open(file_path) as pdf:
        for page_index, page in enumerate(pdf):
            # Texte
            text += page.get_text("text") or ""

            # Images
            for img_index, img in enumerate(page.get_images(full=True)):
                try:
                    xref = img[0]
                    base_image = pdf.extract_image(xref)
                    image_data = base_image["image"]
                    image = Image.open(io.BytesIO(image_data)).convert("RGB")
                    images.append(image)
                except Exception as e:
                    print(f"⚠️ Erreur lors de l’extraction de l’image {img_index} de la page {page_index}: {e}")

    return text, images
