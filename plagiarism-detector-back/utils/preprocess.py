import re
import spacy

nlp = spacy.load("fr_core_news_md")

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zàâçéèêëîïôûùüÿñæœ\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def split_sentences(text):
    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents if sent.text.strip()]
