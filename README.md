# 🧠PlagiaSense AI-Powered Plagiarism Detection 

This project is an **AI-based plagiarism detection system** built with **Flask (Python)** and **React (JavaScript)**.  
It uses **Natural Language Processing (NLP)** and **Generative AI** to detect text similarities, reformulate sentences, and generate intelligent summaries.

---

## 🚀 Features

✅ **Text Plagiarism Detection** – Detects semantic similarity between two documents using embeddings.  
✅ **AI-Based Sentence Reformulation** – Uses **Pegasus** to paraphrase text for originality checking.  
✅ **Multi-Level Summarization** – Generates short or detailed summaries using **FalconsAI/text_summarization**.  
✅ **Image Similarity Detection** – Compares images using extracted visual features (if applicable).  
✅ **REST API (Flask)** – Backend exposes clean, modular endpoints for easy integration.  
✅ **React Frontend** – Simple and responsive interface for file uploads and result visualization.

---

## 🏗️ Tech Stack

**Backend:** Flask, Transformers (Hugging Face), Torch, Apache Tika  
**Frontend:** React + Axios  
**AI Models:**  
- `google/pegasus-xsum` → Reformulation  
- `Falconsai/text_summarization` → Text Summarization  
- Sentence Embeddings → Semantic similarity detection  

---
plagiarism-detector/
│
├── app.py                           # Flask backend
├── utils/
│   ├── extract.py                   # Extract text & images from files
│   ├── preprocess.py                # Text cleaning & sentence splitting
│   ├── vectorize.py                 # Sentence embeddings
│   ├── compare.py                   # Text and image similarity computation
│   ├── reformulate.py               # Pegasus-based reformulation
│   └── ai_summary.py                # FalconsAI summarization pipeline
│
├── uploads/                         # Uploaded test files
├── reference_docs/                  # Reference documents for comparison
└── frontend/                        # React app for UI



