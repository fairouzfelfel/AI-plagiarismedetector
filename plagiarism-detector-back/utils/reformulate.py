# utils/reformulate.py

from transformers import PegasusForConditionalGeneration, PegasusTokenizer

# 🔹 Load the Pegasus model (only once when the app starts)
MODEL_NAME = "tuner007/pegasus_paraphrase"
tokenizer = PegasusTokenizer.from_pretrained(MODEL_NAME)
model = PegasusForConditionalGeneration.from_pretrained(MODEL_NAME)

def reformulate_sentence(sentence: str, num_return_sequences: int = 3):
    """
    Reformulate a sentence using the Pegasus model.
    You can adjust the generation parameters here to control creativity.
    """
    # Tokenize input
    tokens = tokenizer([sentence], truncation=True, padding='longest', return_tensors="pt")

    # 🧠 Generate paraphrases (this is where you can tweak the parameters)
    generated = model.generate(
        **tokens,
        max_length=60,
        num_beams=5,
        num_return_sequences=num_return_sequences,
        temperature=1.3,   # 👈 Increase this for more creative or diverse outputs
        top_k=50,          # 👈 Optional: limits the sampling pool to top 50 words
        top_p=0.95         # 👈 Optional: nucleus sampling for natural text
    )

    # Decode the generated paraphrases
    reformulations = [
        tokenizer.decode(g, skip_special_tokens=True)
        for g in generated
    ]
    return reformulations
