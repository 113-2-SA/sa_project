// Next.js API 路由文件，用於處理向量搜索請求
import { Pinecone } from "@pinecone-database/pinecone"; // 導入 Pinecone 客戶端

// 初始化 Pinecone 客戶端
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,    // 從環境變數獲取 API 密鑰
  environment: process.env.PINECONE_ENV,    // 從環境變數獲取環境設定
});

// 連接到指定的 Pinecone 索引
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

// API 路由處理函數
export default async function handler(req, res) {
  // 檢查請求方法是否為 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 從請求主體中解構出查詢向量
  const { queryVector } = req.body;

  try {
    // 向 Pinecone 發送查詢請求
    const response = await index.query({
      vector: queryVector,        // 查詢向量
      topK: 10,                  // 返回最相似的前 10 個結果
      includeMetadata: true,     // 包含每個匹配項的元數據
    });

    // 返回成功響應，包含匹配結果
    res.status(200).json({ matches: response.matches });
  } catch (error) {
    // 錯誤處理
    console.error('Pinecone query error:', error);  // 在控制台輸出錯誤信息
    res.status(500).json({ message: 'Internal server error' });  // 返回 500 錯誤響應
  }
}
