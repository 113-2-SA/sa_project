// Next.js API 路由文件，用於處理向量搜索請求
import { Pinecone } from "@pinecone-database/pinecone"; // 導入 Pinecone 客戶端

// 初始化 Pinecone 客戶端
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,    // 從環境變數獲取 API 密鑰
  // 不使用 environment，改為使用 controllerHostUrl
  controllerHostUrl: `https://${process.env.PINECONE_INDEX_NAME}-${process.env.PINECONE_ENV}.svc.${process.env.PINECONE_ENV}.pinecone.io`,
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
  
  if (!queryVector || !Array.isArray(queryVector)) {
    return res.status(400).json({ message: 'Invalid query vector' });
  }

  try {
    console.log('處理向量搜索，向量維度:', queryVector.length);
    // 向 Pinecone 發送查詢請求
    const response = await index.query({
      vector: queryVector,        // 查詢向量
      topK: 10,                  // 返回最相似的前 10 個結果
      includeMetadata: true,     // 包含每個匹配項的元數據
    });

    console.log('Pinecone 查詢結果數量:', (response.matches || []).length);
    
    // 返回成功響應，包含匹配結果
    res.status(200).json({ matches: response.matches });
  } catch (error) {
    // 錯誤處理
    console.error('Pinecone query error:', error);  // 在控制台輸出錯誤信息
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });  // 返回 500 錯誤響應
  }
}