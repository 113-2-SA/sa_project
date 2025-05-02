import cohere
#import pinecone
# from pinecone import Pinecone, ServerlessSpec
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import json
from typing import List, Dict
import os
from tqdm import tqdm
from dotenv import load_dotenv
import time

# 載入環境變數
load_dotenv()

def load_qa_data(file_path: str) -> List[Dict]:
    """從 JSON 檔案載入 QA 資料"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_embeddings(texts: List[str], co: cohere.Client) -> List[List[float]]:
    """使用 Cohere API 取得文本的向量"""
    try:
        embeddings = co.embed(
            texts=texts,
            model="embed-multilingual-light-v3.0", #使用多語言模型embed-multilingual-light-v3.0
            input_type="search_query"
        ).embeddings
        return embeddings
    except Exception as e:
        print(f"Embedding 失敗: {e}")
        return []

def upsert_to_pinecone(index, records, retries: int = 3):
    """將向量資料上傳到 Pinecone，失敗時自動重試"""
    for attempt in range(retries):
        try:
            index.upsert(vectors=list(records))
            return
        except Exception as e:
            print(f"Upsert 失敗（第 {attempt+1} 次嘗試）: {e}")
            time.sleep(2)  # 等待 2 秒再重試
    raise Exception("多次嘗試後仍無法上傳 Pinecone")

def process_and_upload(qa_data: List[Dict], 
                      index, 
                      co: cohere.Client, 
                      batch_size: int = 100):
    """批次處理 QA 資料並上傳到 Pinecone"""
    for i in tqdm(range(0, len(qa_data), batch_size), desc="上傳進度"):
        batch = qa_data[i:i + batch_size]
        
        # 準備問題列表和對應 metadata
        questions = [item['question'] for item in batch]
        ids = [f"q_{i+j}" for j in range(len(batch))]
        metadata = [
            {
                "answer": item['answer'],
                "level": item['level'],
                "keyword": item['keyword'],
                "related": item['related'],
                "category": item['category']
            }
            for item in batch
        ]

        # 取得 embeddings
        vectors = get_embeddings(questions, co)

        # 檢查 embeddings 是否成功
        if not vectors or len(vectors) != len(questions):
            print(f"第 {i} 批次的 embeddings 數量不符，跳過這批")
            continue

        # 整理成 Pinecone 需要的格式
        records = zip(ids, vectors, metadata)

        # 上傳至 Pinecone（帶有重試機制）
        upsert_to_pinecone(index, records)


def main():
    # 從環境變數讀取 API KEY 和設定
    COHERE_API_KEY = os.getenv("COHERE_API_KEY")
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_ENV = os.getenv("PINECONE_ENV")
    INDEX_NAME = "faq-embeddings"

    # 確認 API KEY 是否存在
    if not all([COHERE_API_KEY, PINECONE_API_KEY, PINECONE_ENV]):
        raise EnvironmentError("請確認 .env 檔內有正確設定 API KEY 與環境變數")
    print("API KEY 和環境變數已正確載入")

    # 初始化 Cohere
    co = cohere.Client(COHERE_API_KEY)
    print("Cohere 客戶端已初始化")

    # 初始化 Pinecone 客戶端
    pc = Pinecone(api_key=PINECONE_API_KEY)
    print("Pinecone 客戶端已初始化")

    # 檢查並建立 Pinecone Index
    if INDEX_NAME not in [i['name'] for i in pc.list_indexes()]:
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,  # embed-multilingual-light-v3.0 的向量維度是 384
            metric="cosine",  # 使用 cosine 相似度
            spec=ServerlessSpec(
                cloud="aws",      # 你的 Pinecone 是 AWS 還是 GCP
                region=PINECONE_ENV
        )
    )
    index = pc.Index(INDEX_NAME) # 使用 pc 實例來創建或連接到 Index
    
    # 載入 QA 資料
    qa_data = load_qa_data("C:\Users\pengv\OneDrive - 輔仁大學\桌面\sa_project\src\FAQ\QA.json") # 用絕對路徑
    print(qa_data[:1])  # 顯示前五筆資料以確認格式
    # 檢查資料型態是否為list rather than set ->print(type(qa_data))
    # 開始批次上傳
    process_and_upload(qa_data, index, co)

    print(f"成功處理並上傳 {len(qa_data)} 筆 QA 資料到 Pinecone!")

if __name__ == "__main__":
    main()
