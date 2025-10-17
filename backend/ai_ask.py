from fastapi import APIRouter
from pydantic import BaseModel
import os, threading, requests, chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

router = APIRouter()
_index_started = False
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://ollama:11434")

# === Modell és Chroma inicializálás ===
embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
chroma_client = chromadb.Client(Settings(persist_directory="./chromadb"))
collection = chroma_client.get_or_create_collection("docs")

# Egyszerű memóriatároló (később lehet user sessionhöz kötni)
conversation_history = []

# === Helper függvények ===
def load_documents(folder_path="./documents"):
    docs = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):
            with open(os.path.join(folder_path, filename), "r", encoding="utf-8") as f:
                content = f.read().replace("\n", " ").replace("  ", " ").strip()
                docs.append({"name": filename, "content": content})
    return docs

def chunk_text(text, chunk_size=500, overlap=50):
    chunks, start = [], 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def ensure_index():
    if len(collection.get()["ids"]) == 0:
        print("📚 Index üres, dokumentumok feldolgozása...")
        docs = load_documents()
        for doc in docs:
            chunks = chunk_text(doc["content"])
            for i, chunk in enumerate(chunks):
                emb = embedder.encode(chunk).tolist()
                collection.add(
                    ids=[f"{doc['name']}_{i}"],
                    documents=[f"{doc['name']}: {chunk}"],
                    metadatas=[{"source": doc["name"]}],
                    embeddings=[emb]
                )
        print("✅ Index létrehozva.")

def ensure_index_background():
    global _index_started
    if not _index_started:
        _index_started = True
        threading.Thread(target=ensure_index, daemon=True).start()
        print("🧠 Dokumentum indexelés fut a háttérben...")

ensure_index_background()

# === Keresés és válasz ===
def search_relevant_chunks(question, top_k=6):
    q_emb = embedder.encode(question).tolist()
    results = collection.query(query_embeddings=[q_emb], n_results=top_k)
    return results["documents"][0] if results["documents"] else []

def ask_ollama(question: str):
    chunks = search_relevant_chunks(question)
    context = "\n\n".join(chunks)

    # 🔁 Legutóbbi 5 üzenet kontextusként
    history_context = "\n".join(
        [f"Felhasználó: {msg['user']}\nAsszisztens: {msg['bot']}" for msg in conversation_history[-5:]]
    )

    prompt = f"""
Te egy magyar nyelvű szakértő asszisztens vagy, aki dokumentumok alapján válaszol.

🧩 Szabályok:
- Mindig magyarul válaszolj.
- Csak a dokumentumrészletekre támaszkodj.
- Ha nincs releváns információ: "Nem található a dokumentumban."
- A beszélgetés folyamatosságát tartsd fenn: vedd figyelembe a korábbi kérdéseket is.
- Légy rövid, pontos, logikus.

📄 Dokumentumrészletek:
{context}

💬 Korábbi beszélgetés:
{history_context}

❓ Aktuális kérdés:
{question}

🧠 Válasz (magyarul):
"""

    response = requests.post(
        f"{OLLAMA_HOST}/api/generate",
        json={"model": "llama3:8b-instruct-q4_0", "prompt": prompt, "stream": False},
        timeout=120
    )

    if response.status_code != 200:
        print("⚠️ Ollama API hiba:", response.text)
        return "⚠️ Hiba az Ollama API hívásakor"

    data = response.json()
    answer = data.get("response", "").strip() or "⚠️ Üres válasz érkezett."

    # 🧩 Mentjük a beszélgetést
    conversation_history.append({"user": question, "bot": answer})

    return answer

# === API végpont ===
class Question(BaseModel):
    question: str

@router.post("/ask")
async def ask_api(q: Question):
    ensure_index_background()
    answer = ask_ollama(q.question)
    print(f"🧠 Kérdés: {q.question}")
    print(f"💬 Válasz: {answer}")
    return {"answer": answer}
