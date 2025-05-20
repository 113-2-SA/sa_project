# 導入必要的套件
import cohere # 用於生成文本嵌入向量的 API 客戶端
from pinecone import Pinecone
import json # 處理 JSON 檔案
from typing import List, Dict # 型別提示用的類型
import os # 操作系統相關功能
from tqdm import tqdm # 顯示進度條
from dotenv import load_dotenv # 載入環境變數
import time # 處理時間相關操作

# 載入.env 檔案中的環境變數
load_dotenv()

def load_qa_data(file_path: str) -> List[Dict]:
    """從 JSON 檔案載入 QA 資料"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f) # 將 JSON 檔案轉換為 Python 物件


def get_embeddings(texts: List[str], co: cohere.Client) -> List[List[float]]:
    """使用 Cohere API 取得文本的向量"""
    try:
        # 用 Cohere API 將文本轉換為向量
        embeddings = co.embed(
            texts=texts,# 要轉換的文本列表
            model="embed-multilingual-light-v3.0", #用多語言模型embed-multilingual-light-v3.0
            input_type="search_query" # 指定輸入類型為搜尋查詢
        ).embeddings
        return embeddings
    except Exception as e:
        print(f"Embedding 失敗: {e}")  # 輸出錯誤訊息
        return [] # 失敗時返回空列表

def upsert_to_pinecone(index, records, retries: int = 3):
    """將向量資料上傳到 Pinecone，失敗時自動重試"""
    for attempt in range(retries): # 最多重試指定次數
        try:
            index.upsert(vectors=(records)) # 上傳向量到 Pinecone
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
        
        # 過濾掉缺少必要欄位的資料
        valid_batch = [item for item in batch if all(key in item for key in ['question', 'answer', 'level', 'keyword', 'related', 'category','resource'])]
        
        if not valid_batch:
            print(f"第 {i} 批次沒有有效資料，跳過")
            continue
            
        # 準備問題列表和對應 metadata
        questions = [item['question'] for item in valid_batch]
        ids = [f"q_{i+j}" for j in range(len(valid_batch))]
        metadata = [
            {
                "answer": item['answer'],
                "level": item['level'],
                "keyword": item['keyword'],
                "related": item['related'],
                "category": item['category'],
                "resource": item['resource']
            }
            for item in valid_batch
        ]

        # 取得問題的 embeddings
        vectors = get_embeddings(questions, co)

        # 檢查 embeddings 是否成功
        if not vectors or len(vectors) != len(questions):
            print(f"第 {i} 批次的 embeddings 數量不符，跳過這批")
            continue

        # 整理成 Pinecone 需要的格式
        records = [{"id": ids[j], "values": vectors[j], "metadata": metadata[j]} for j in range(len(valid_batch))]

        # 上傳至 Pinecone（帶有重試機制）
        upsert_to_pinecone(index, records)


def clear_pinecone_index(index, batch_size=100):
    print("開始清空 Pinecone Index 中的舊資料...")
    try:
        # 使用 delete_all 方法直接清空整個 index
        index.delete(delete_all=True)
        print("Pinecone Index 已清空完畢！")
    except Exception as e:
        print(f"清空 Index 時發生錯誤: {e}")
        raise

def main():
    # 從環境變數讀取 API KEY 和設定
    COHERE_API_KEY = os.getenv("COHERE_API_KEY")
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_ENV = os.getenv("PINECONE_ENV")
    INDEX_NAME = "faq-embeddings" # Pinecone index名

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

    
    # 確認 Index 是否存在，否則建立
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,
            metric="cosine",
            spec={
                "serverless": {
                    "cloud": "aws",
                    "region": "us-east-1"
                }
            }
        )

    index = pc.Index(INDEX_NAME)
    
    # 清空舊資料（初始化）
    clear_pinecone_index(index)
    
    # 載入 QA 資料
    qa_data = load_qa_data(r"C:\Users\pengv\桌面\sa_project\src\FAQ\QA.json") # 用絕對路徑
    print(qa_data[:1])  # 顯示第一筆資料以確認格式
    # print(type(qa_data)) -> 檢查資料型態是否為list rather than set
    # 開始批次上傳
    process_and_upload(qa_data, index, co)

    print(f"成功處理並上傳 {len(qa_data)} 筆 QA 資料到 Pinecone!")

if __name__ == "__main__":
    main()
