def generate_report(similar_items, total_sentences):
    """
    Génère un rapport clair et interprétatif pour texte et image
    """

    text_matches = [m for m in similar_items if m["type"] == "text"]
    image_matches = [m for m in similar_items if m["type"] == "image"]

    # Score texte
    unique_sentences = set([s["sentence"] for s in text_matches])
    plagiarized = len(unique_sentences)
    if total_sentences > 0:
        score = round((plagiarized / total_sentences) * 100, 2)
    else:
        score = 0.0
    score = min(score, 100.0)

    # Niveau de risque texte
    if score == 0:
        level = "Aucun risque"
        interpretation = "Aucune similarité détectée. Le document semble entièrement original."
    elif score < 25:
        level = "Faible"
        interpretation = "Quelques similarités mineures ont été détectées, probablement des coïncidences ou citations correctes."
    elif score < 50:
        level = "Modéré"
        interpretation = "Des portions significatives du texte ressemblent à d’autres sources. Une révision ou citation est conseillée."
    elif score < 75:
        level = "Élevé"
        interpretation = "Une part importante du document semble similaire à des textes existants. Vérifier les sources et reformuler."
    else:
        level = "Critique"
        interpretation = "Le document présente un risque très élevé de plagiat. De larges sections semblent copiées."

    return {
        "plagiarism_score_text": score,
        "plagiarized_sentences": plagiarized,
        "total_sentences": total_sentences,
        "risk_level": level,
        "interpretation": interpretation,
        "text_matches": text_matches,
        "image_matches": image_matches,
        "total_images_checked": len(image_matches)
    }
