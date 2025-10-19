# utils/summarization.py
from transformers import pipeline
import torch

class DetectionSummarizer:
    def __init__(self):
        # Utiliser un modèle plus léger pour la summarization
        try:
            self.summarizer = pipeline(
                "summarization",
                model="Falconsai/text_summarization",  # Modèle plus léger
                tokenizer="Falconsai/text_summarization",
                framework="pt"
            )
            self.model_loaded = True
            print("✅ Modèle de summarization chargé avec succès")
        except Exception as e:
            print(f"⚠️ Impossible de charger le modèle de summarization: {e}")
            self.model_loaded = False
    
    def generate_detection_summary(self, report_data, language="fr"):
        """
        Generate AI-powered summary of plagiarism detection results
        """
        try:
            # Préparer le texte d'analyse
            analysis_text = self._prepare_analysis_text(report_data)
            
            if self.model_loaded and language == "en":
                # Générer le résumé avec le modèle (seulement pour l'anglais)
                summary_result = self.summarizer(
                    analysis_text,
                    max_length=150,
                    min_length=50,
                    do_sample=False
                )
                summary = summary_result[0]['summary_text']
            else:
                # Fallback en français ou si modèle non chargé
                summary = self._generate_french_summary_fallback(report_data)
            
            # Générer les recommandations
            recommendations = self._generate_recommendations(report_data)
            
            return {
                "summary": summary,
                "recommendations": recommendations,
                "key_findings": self._extract_key_findings(report_data)
            }
            
        except Exception as e:
            print(f"❌ Erreur lors de la génération du résumé: {e}")
            return self._generate_template_summary(report_data)
    
    def _prepare_analysis_text(self, report_data):
        """Prepare detailed text for summarization"""
        text_score = report_data.get("plagiarism_score_text", 0)
        image_score = report_data.get("plagiarism_score_image", 0)
        combined_score = report_data.get("plagiarism_score_combined", 0)
        total_sentences = report_data.get("total_sentences", 0)
        total_images = report_data.get("total_images_checked", 0)
        
        text_matches = report_data.get("text_matches", [])
        image_matches = report_data.get("image_matches", [])
        
        analysis_text = f"""
        Plagiarism Detection Results:
        Overall plagiarism score: {combined_score}%
        Text plagiarism: {text_score}% with {len(text_matches)} text matches found.
        Image plagiarism: {image_score}% with {len(image_matches)} image matches found.
        Total sentences analyzed: {total_sentences}
        Total images analyzed: {total_images}
        Risk level: {report_data.get('risk_level', 'Unknown')}
        """
        
        return analysis_text
    
    def _generate_french_summary_fallback(self, report_data):
        """Generate French summary without AI model"""
        score = report_data.get("plagiarism_score_combined", 0)
        text_matches = len(report_data.get("text_matches", []))
        image_matches = len(report_data.get("image_matches", []))
        
        if score == 0:
            return "Aucun plagiat détecté. Le document semble entièrement original."
        elif score < 10:
            return f"Risque très faible de plagiat ({score}%). Similarités négligeables."
        elif score < 25:
            return f"Risque faible de plagiat ({score}%). {text_matches} similarités mineures détectées."
        elif score < 50:
            return f"Risque modéré de plagiat ({score}%). {text_matches} similarités textuelles nécessitent une révision."
        elif score < 75:
            return f"Risque élevé de plagiat ({score}%). {text_matches} similarités textuelles et {image_matches} similarités d'images détectées."
        else:
            return f"Risque critique de plagiat ({score}%). Révision complète requise."
    
    def _generate_recommendations(self, report_data):
        """Generate recommendations based on findings"""
        score = report_data.get("plagiarism_score_combined", 0)
        text_matches = report_data.get("text_matches", [])
        image_matches = report_data.get("image_matches", [])
        
        recommendations = []
        
        if score > 50:
            recommendations.append("📝 **Révision majeure nécessaire**: Le document présente un risque élevé de plagiat.")
        elif score > 25:
            recommendations.append("📝 **Révision modérée recommandée**: Certaines sections nécessitent une reformulation.")
        else:
            recommendations.append("✅ **Document généralement original**: Seules des similarités mineures détectées.")
        
        high_similarity_text = [m for m in text_matches if m.get("similarity", 0) > 0.8]
        if high_similarity_text:
            recommendations.append(f"🔍 **{len(high_similarity_text)} phrases** présentent une similarité très élevée.")
        
        if image_matches:
            recommendations.append("🖼️ **Images similaires détectées**: Vérifiez les droits d'utilisation.")
        
        recommendations.append("💡 **Utilisez l'outil de reformulation** pour réécrire les phrases problématiques.")
        recommendations.append("📚 **Citez vos sources** lorsque vous utilisez le travail d'autres auteurs.")
        
        return recommendations
    
    def _extract_key_findings(self, report_data):
        """Extract key numerical findings"""
        return {
            "overall_score": report_data.get("plagiarism_score_combined", 0),
            "text_score": report_data.get("plagiarism_score_text", 0),
            "image_score": report_data.get("plagiarism_score_image", 0),
            "text_matches_count": len(report_data.get("text_matches", [])),
            "image_matches_count": len(report_data.get("image_matches", [])),
            "risk_level": report_data.get("risk_level", "Unknown"),
            "documents_compared": report_data.get("documents_compared", 1)
        }
    
    def _generate_template_summary(self, report_data):
        """Fallback template-based summary"""
        return {
            "summary": self._generate_french_summary_fallback(report_data),
            "recommendations": self._generate_recommendations(report_data),
            "key_findings": self._extract_key_findings(report_data)
        }

# Global instance
detection_summarizer = DetectionSummarizer()