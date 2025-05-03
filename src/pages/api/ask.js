// Next.js API 路由文件，處理問答功能
import { Pinecone } from "@pinecone-database/pinecone"; // 導入 Pinecone 向量數據庫客戶端

// 初始化 Pinecone 客戶端
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,    // 從環境變數獲取 Pinecone API 密鑰
//   environment: process.env.PINECONE_ENV,    // 從環境變數獲取 Pinecone 環境設定
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

  // 從請求主體中獲取查詢文本
  const { query } = req.body;

  try {
    // 1. 使用 Cohere API 將問題轉換為向量
    const embedResponse = await fetch('https://api.cohere.com/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`, // Cohere API 認證
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'embed-multilingual-light-v3.0',  // 使用多語言模型
        input: [query],  // 將查詢文本轉換為向量
      }),
    });

    // 解析 Cohere API 的響應
    const embedData = await embedResponse.json();
    const queryVector = embedData.embeddings[0];  // 獲取查詢文本的向量表示
    console.log('Cohere embed response:', embedData);  // 輸出向量結果以進行調試

    // 2. 使用向量在 Pinecone 中搜索相似內容
    const pineconeResponse = await index.query({
      vector: queryVector,    // 查詢向量
      topK: 5,              // 返回最相似的 5 個結果
      includeMetadata: true,  // 包含元數據
    });
    console.log('Pinecone query result:', pineconeResponse.matches);  // 輸出查詢結果以進行調試

    // 將搜索結果轉換為上下文文本
    // const contexts = pineconeResponse.matches.map(
    //   (match, idx) => `${idx + 1}. ${match.metadata.text || match.metadata.content}`
    // ).join('\n');
    const matches = pineconeResponse.matches || [];
    const contexts = matches.map(
      (match, i) => `${i + 1}. ${match.metadata.answer || match.metadata.text || ''}`
    ).join('\n');

    // 檢查是否有找到相關上下文
    if (!contexts) {
      return '資料中未提及';
    }

    // 3. 構建提示詞
    const finalPrompt = `
你是一個輔仁大學資訊管理學系的助理，根據以下資料回答問題。如果資料中沒有答案，請誠實回答不知道。

資料如下：
${contexts || "查無相關資料"}

使用這些資料來回答這個問題：
${query}
請以條列清楚、有邏輯、誠實回答。若無資料，請說「資料中未提及」。
`;

    // 4. 使用 Groq API 生成回答
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,  // Groq API 認證
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',  // 使用 Llama 3 模型
        messages: [
          { role: "user", content: finalPrompt }  // 設置對話內容
        ]
      }),
    });

    // 解析 Groq API 的響應
    const groqData = await groqResponse.json();
    //const answer = groqData.choices[0].message.content;  // 獲取生成的回答
    const answer = groqData.choices?.[0]?.message?.content || '⚠ 無法取得答案';

    // 返回結果，包含調試信息
    res.status(200).json({
      answer,
      debug: {
        query,          // 原始查詢
        prompt: finalPrompt,  // 使用的提示詞
        //contexts: pineconeResponse.matches,  // 相關上下文
        matches
      }
    });
    
  } catch (error) {
    // 錯誤處理
    console.error('Ask API error:', error);  // 輸出錯誤信息
    res.status(500).json({ message: 'Internal server error' });  // 返回錯誤響應
  }
}
