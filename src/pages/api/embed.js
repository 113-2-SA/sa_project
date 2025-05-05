// /pages/api/embed.js
// Next.js API 路由處理函數，用於生成文本嵌入向量
export default async function handler(req, res) {
  try {
      // 從請求主體解析出文本內容
      const { text } = JSON.parse(req.body);
      console.log('處理嵌入向量請求，文本:', text ? text.substring(0, 50) + '...' : 'empty');
      
      // 發送請求到 Cohere API 生成嵌入向量
      const response = await fetch('https://api.cohere.com/v1/embed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'Cohere-Version': '2022-12-06'  // 添加 API 版本號
        },
        body: JSON.stringify({
          texts: [text],  // 使用 'texts' 而不是 'input'
          model: 'embed-multilingual-light-v3.0',  // 確保與 ask.js 使用相同的模型
          input_type: 'search_query',  // 指定輸入類型
          truncate: 'END'  // 指定截斷方式
        }),
      });

      // 檢查 API 響應狀態
      if (!response.ok) {
        const error = await response.json();
        console.error('Cohere API 錯誤:', error);
        return res.status(response.status).json(error);
      }

      // 解析 API 回應的 JSON 數據
      const data = await response.json();
      
      // 發送回應，包含錯誤處理
      if (data.embeddings && data.embeddings[0]) {
        console.log('成功生成嵌入向量，維度:', data.embeddings[0].length);
        res.status(200).json({ embedding: data.embeddings[0] });
      } else {
        console.error('無法生成嵌入向量，回應:', data);
        res.status(500).json({ error: 'Failed to generate embedding' });
      }
  } catch (error) {
      console.error('嵌入向量生成錯誤:', error);
      res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
