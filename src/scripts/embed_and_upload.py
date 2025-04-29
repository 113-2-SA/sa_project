import os
import time
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
# from pinecone import ServerlessSpec ← 僅建立新 index 時才需用

# === 設定 ===
SOURCE_DIR = './src/utils/dataFiles'  # 放 .pdf 的資料夾
INDEX_NAME = 'faq-embeddings'
EMBED_MODEL = 'all-MiniLM-L6-v2'

# ✅ 初始化 Pinecone SDK（新版）
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
index = pc.Index(INDEX_NAME)

# ✅ 初始化 embedding 模型
model = SentenceTransformer(EMBED_MODEL)

# ✅ 分段函數：每段約 700 字（優雅切句）
def split_text(text, chunk_size=700):
    chunks = []
    while len(text) > chunk_size:
        cut = text[:chunk_size]
        last_period = cut.rfind('.')
        if last_period == -1:
            last_period = chunk_size
        chunks.append(text[:last_period].strip())
        text = text[last_period:]
    if text.strip():
        chunks.append(text.strip())
    return chunks

# ✅ 讀取所有 .pdf 並處理
for filename in os.listdir(SOURCE_DIR):
    if filename.endswith('.pdf'):
        file_path = os.path.join(SOURCE_DIR, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        chunks = split_text(content)

        print(f'📄 {filename} - 共 {len(chunks)} 段')

        # 向量化 & 上傳
        embeddings = model.encode(chunks).tolist()
        vectors = [{
            'id': f"{filename}-{i}",
            'values': emb,
            'metadata': {'source': filename, 'text': chunks[i]}
        } for i, emb in enumerate(embeddings)]

        for i in range(0, len(vectors), 100):
            index.upsert(vectors[i:i+100])
            time.sleep(0.5)

        print(f'✅ 已上傳到 Pinecone：{filename}')
