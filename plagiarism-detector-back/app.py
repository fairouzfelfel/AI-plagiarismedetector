# app.py
from flask import Flask, request, jsonify
import os
import time
from flask_cors import CORS

# -------------------------------
# 🔹 Configuration Flask
# -------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

REFERENCE_DIR = "reference_docs"
UPLOAD_DIR = "uploads"

# Crée les dossiers s'ils n'existent pas
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REFERENCE_DIR, exist_ok=True)

# Pondération du score global
TEXT_WEIGHT = 0.8
IMAGE_WEIGHT = 0.2

# Fonction manquante
def calculate_risk_level(score):
    """Calculate risk level based on combined score"""
    if score == 0:
        return "Aucun risque"
    elif score < 10:
        return "Très faible"
    elif score < 25:
        return "Faible"
    elif score < 50:
        return "Modéré"
    elif score < 75:
        return "Élevé"
    else:
        return "Critique"

# Import des modules avec gestion d'erreurs
try:
    from utils.extract import extract_text_from_file, extract_text_and_images_from_pdf
    from utils.preprocess import clean_text, split_sentences
    from utils.vectorize import embed_sentences
    from utils.compare import compare_documents, extract_image_features, compare_image_embeddings
    from utils.reformulate import reformulate_sentence
    
    # Essayer d'importer le summarizer, mais fournir une alternative si absent
    try:
        from utils.summarization import detection_summarizer
        SUMMARIZATION_AVAILABLE = True
    except ImportError:
        print("⚠️ Summarization module not available, using fallback")
        SUMMARIZATION_AVAILABLE = False
        # Fallback pour la summarization
        def generate_fallback_summary(report_data):
            score = report_data.get("plagiarism_score_combined", 0)
            text_matches = len(report_data.get("text_matches", []))
            image_matches = len(report_data.get("image_matches", []))
            
            if score == 0:
                summary = "Aucun plagiat détecté. Le document semble entièrement original."
            elif score < 25:
                summary = f"Risque faible de plagiat ({score}%). Seulement {text_matches} similarités mineures détectées."
            elif score < 50:
                summary = f"Risque modéré de plagiat ({score}%). {text_matches} similarités textuelles nécessitent une révision."
            elif score < 75:
                summary = f"Risque élevé de plagiat ({score}%). {text_matches} similarités textuelles et {image_matches} similarités d'images détectées."
            else:
                summary = f"Risque très élevé de plagiat ({score}%). Révision complète nécessaire."
            
            recommendations = [
                "Utilisez l'outil de reformulation pour améliorer les passages similaires.",
                "Citez vos sources lorsque vous utilisez le travail d'autres auteurs."
            ]
            
            return {
                "summary": summary,
                "recommendations": recommendations,
                "key_findings": {
                    "overall_score": score,
                    "text_score": report_data.get("plagiarism_score_text", 0),
                    "image_score": report_data.get("plagiarism_score_image", 0),
                    "text_matches_count": text_matches,
                    "image_matches_count": image_matches,
                    "risk_level": report_data.get("risk_level", "Unknown"),
                    "documents_compared": report_data.get("documents_compared", 1)
                }
            }
        
        detection_summarizer = type('obj', (object,), {
            'generate_detection_summary': lambda self, report_data, language="fr": generate_fallback_summary(report_data)
        })()

except ImportError as e:
    print(f"❌ Erreur d'importation des modules utils: {e}")
    print("⚠️ Assurez-vous que tous les fichiers utils/*.py existent")

# -------------------------------------------------------------------
# 🔹 Route 1 : Détection de plagiat
# -------------------------------------------------------------------
@app.route('/detect', methods=['POST'])
def detect_plagiarism():
    """
    Enhanced plagiarism detection with AI-powered summarization
    """
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files['file']
    if file.filename == "":
        return jsonify({"error": "Nom de fichier invalide"}), 400

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(file_path)

    try:        
        # Extraction du texte et des images
        text, images = extract_text_and_images_from_pdf(file_path)
        text_clean = clean_text(text)
        sentences = split_sentences(text_clean)
        text_embeddings = embed_sentences(sentences)

        all_text_matches = []
        all_image_matches = []
        documents_compared = 0

        # Vérifier si le dossier de référence existe et contient des fichiers
        if not os.path.exists(REFERENCE_DIR) or not os.listdir(REFERENCE_DIR):
            return jsonify({"error": "Aucun document de référence trouvé dans le dossier 'reference_docs'"}), 400

        # Comparaison avec les fichiers de référence
        for ref_file in os.listdir(REFERENCE_DIR):
            ref_path = os.path.join(REFERENCE_DIR, ref_file)
            
            # Ignorer les fichiers cachés
            if ref_file.startswith('.'):
                continue
                
            try:
                ref_text = clean_text(extract_text_from_file(ref_path))
                ref_sentences = split_sentences(ref_text)
                
                if not ref_sentences:
                    continue
                    
                ref_embeddings = embed_sentences(ref_sentences)

                matches = compare_documents(
                    text_embeddings, ref_embeddings, sentences, ref_sentences, doc_type="text"
                )
                all_text_matches.extend(matches)

                # Image comparison
                if ref_file.lower().endswith('.pdf'):
                    try:
                        _, ref_images = extract_text_and_images_from_pdf(ref_path)
                        if images and ref_images:
                            # Use basic image comparison
                            image_embeddings = [extract_image_features(img) for img in images]
                            ref_image_embeddings = [extract_image_features(img) for img in ref_images]
                            
                            matches = compare_image_embeddings(
                                image_embeddings, ref_image_embeddings, images, ref_images
                            )
                            all_image_matches.extend(matches)
                    except Exception as e:
                        print(f"⚠️ Erreur lors de l'analyse des images pour {ref_file}: {e}")
                        continue
                
                documents_compared += 1
                
            except Exception as e:
                print(f"⚠️ Erreur avec le fichier de référence {ref_file}: {e}")
                continue

        # Calculate scores
        unique_text_matches = len(set([m.get('sentence', '') for m in all_text_matches]))
        text_score = round((unique_text_matches / max(len(sentences), 1)) * 100, 2)
        text_score = min(100.0, text_score)

        if images:
            # Correction: utiliser 'image_index' au lieu de 'image'
            unique_image_matches = len(set([f"{m.get('image_index', '')}_{m.get('matched_with_index', '')}" for m in all_image_matches]))
            image_score = round((unique_image_matches / max(len(images), 1)) * 100, 2)
            image_score = min(100.0, image_score)
        else:
            image_score = 0.0

        combined_score = round(text_score * TEXT_WEIGHT + image_score * IMAGE_WEIGHT, 2)

        # Risk level calculation
        risk_level = calculate_risk_level(combined_score)

        # Basic report structure
        basic_report = {
            "plagiarism_score_text": text_score,
            "plagiarism_score_image": image_score,
            "plagiarism_score_combined": combined_score,
            "total_sentences": len(sentences),
            "total_images_checked": len(images),
            "text_matches": all_text_matches[:20],  # Limit for response size
            "image_matches": all_image_matches[:20],
            "risk_level": risk_level,
            "documents_compared": documents_compared,
        }

        # Generate AI-powered summary
        try:
            if SUMMARIZATION_AVAILABLE:
                summary_report = detection_summarizer.generate_detection_summary(basic_report, language="fr")
            else:
                summary_report = generate_fallback_summary(basic_report)
        except Exception as e:
            print(f"⚠️ Erreur lors de la génération du résumé: {e}")
            summary_report = generate_fallback_summary(basic_report)

        # Combine basic report with summary
        final_report = {**basic_report, **summary_report}

        # Nettoyer le fichier uploadé
        try:
            os.remove(file_path)
        except:
            pass

        return jsonify(final_report), 200

    except Exception as e:
        # Nettoyer le fichier uploadé en cas d'erreur
        try:
            if 'file_path' in locals():
                os.remove(file_path)
        except:
            pass
            
        return jsonify({"error": f"Erreur interne : {str(e)}"}), 500

# -------------------------------------------------------------------
# 🔹 Route 2 : Reformulation automatique
# -------------------------------------------------------------------
@app.route("/reformulate", methods=["POST"])
def reformulate_text():
    try:
        data = request.get_json()
        sentence = data.get("sentence")

        if not sentence or not sentence.strip():
            return jsonify({"error": "Aucune phrase fournie"}), 400

        reformulations = reformulate_sentence(sentence, num_return_sequences=3)

        return jsonify({
            "original": sentence,
            "reformulations": reformulations
        }), 200

    except Exception as e:
        return jsonify({"error": f"Erreur lors de la reformulation : {str(e)}"}), 500

# -------------------------------------------------------------------
# 🔹 Route 3 : Vérification de la santé de l'API
# -------------------------------------------------------------------
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "API de détection de plagiat opérationnelle",
        "reference_docs_count": len([f for f in os.listdir(REFERENCE_DIR) if not f.startswith('.')]) if os.path.exists(REFERENCE_DIR) else 0
    }), 200

# -------------------------------------------------------------------
# 🚀 Lancement du serveur Flask
# -------------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 Démarrage de l'API de détection de plagiat...")
    print(f"📁 Dossier des références: {REFERENCE_DIR}")
    print(f"📁 Dossier des uploads: {UPLOAD_DIR}")
    print("📍 API accessible sur: http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)