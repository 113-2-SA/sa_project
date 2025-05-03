// /pages/api/embed.js
// Next.js API 路由處理函數，用於生成文本嵌入向量
export default async function handler(req, res) {
    // 從請求主體解析出文本內容
    const { text } = JSON.parse(req.body);
  
    // 發送請求到 Cohere API 生成嵌入向量
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'  // 添加 API 版本號
      },
      body: JSON.stringify({
        texts: [text],  // 改用 'texts' 而不是 'input'
        model: 'embed-multilingual-v3.0',  // 用最新的模型版本
        input_type: 'search_query',  // 指定輸入類型
        truncate: 'END'  // 指定截斷方式
      }),
    });

    // 檢查 API 響應狀態
    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    // 解析 API 回應的 JSON 數據
    const data = await response.json();
    
    // 發送回應，包含錯誤處理
    if (data.embeddings && data.embeddings[0]) {
      res.status(200).json({ embedding: data.embeddings[0] });
    } else {
      res.status(500).json({ error: 'Failed to generate embedding' });
    }
}
