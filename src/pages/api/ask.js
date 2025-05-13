import { Pinecone } from "@pinecone-database/pinecone";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query, postsData } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ answer: '請提供查詢文字', debug: { error: 'Missing query' } });
  }

  try {
    console.log('📩 接收到查詢 query:', query);
    //console.log('👨‍🏫 傳入的 professorData 型別:', typeof professorData);
    console.log('📝 傳入的 postsData 筆數:', Array.isArray(postsData) ? postsData.length : '不是陣列');

    // 1. 呼叫 Cohere 取得向量
    const embedResponse = await fetch('https://api.cohere.com/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'
      },
      body: JSON.stringify({
        model: 'embed-multilingual-light-v3.0',
        texts: [query],
        input_type: 'search_query',
        truncate: 'END'
      }),
    });

    const embedData = await embedResponse.json();
    const queryVector = embedData.embeddings?.[0];
    if (!queryVector) throw new Error('Cohere 嵌入向量生成失敗');

    console.log('✅ 取得查詢向量 (前 5 維):', queryVector.slice(0, 5), '... 維度:', queryVector.length);

    // 2. 查詢 Pinecone
    let matches = [];
    let pineconeContexts = '（無相關知識庫資料）';

    //console.log('key', process.env.PINECONE_API_KEY);
    try {
      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
        //controllerHostUrl: "https://faq-embeddings-xqnx9wx.svc.aped-4627-b74a.pinecone.io",
      });
      
      const index = pinecone.index("faq-embeddings");
      
      const result = await index.query({
        vector: queryVector,
        topK: 5,
        includeMetadata: true,
      });

      matches = result.matches || [];
      console.log('🔍 Pinecone 查詢結果:', matches);
      console.log('📦 Pinecone 回傳筆數:', matches.length);
      
      // 3. 組合 Pinecone 回傳內容
      if (matches.length > 0) {
        pineconeContexts = matches.map((match, i) => {
          const metadata = match.metadata || {};
          const fields = Object.entries(metadata)
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n');
          return `#${i + 1}\n${fields}`;
        }).join('\n\n');
      }
    } catch (error) {
      console.error('Pinecone 查詢錯誤:', error);
    }

    console.log('🧠 Pinecone 組合後內容:', pineconeContexts);

    // 從 Pinecone 直接提取答案
    let directAnswer = '⚠ 無法從知識庫獲取回答';
    if (matches.length > 0 && matches[0].metadata && matches[0].metadata.answer) {
      // 使用得分最高的匹配項的答案
      directAnswer = matches[0].metadata.answer;
      console.log('🎯 直接從 Pinecone 獲取答案:', directAnswer);
    }

    // 4. 處理教授與貼文資料
    const postsText = Array.isArray(postsData)
      ? postsData.map((post, i) => {
          const comments = post.comments?.map(c => `- ${c.content}`).join('\n') || '';
          return `📌 [${i + 1}] ${post.title}\n${post.content}\n留言：\n${comments}`;
        }).join('\n\n')
      : '（未提供貼文資料）';

    // const professorText = typeof professorData === 'string'
    //   ? professorData
    //   : JSON.stringify(professorData || '（未提供教授資料）');

    // 5. 整合所有 context
    const totalContext = `
    【以下是三種不同來源的輔助資料，請根據它們回答使用者的問題，並在回答中清楚標示出資訊來自哪個來源：

    📚 來自 Pinecone 資料庫：
    ${pineconeContexts || '（無相關知識庫資料）'}

    

    💬 貼文與留言摘要：
    ${postsText || '（無貼文資料）'}
    `.trim();

        // 6. 組合提示詞
        const finalPrompt = `
    你是一個輔仁大學資訊管理學系的智能助理，根據以下資料回答問題。如果資料中沒有答案，請誠實回答不知道。
    【以下是來自 Pinecone 資料庫與討論區貼文的輔助資料，請根據它們回答使用者的問題：】

    ${totalContext}

    使用這些資料來回答這個問題：
    ${query}
    請以條列清楚、有邏輯、誠實回答。若無資料，請說「資料中未提及」。
    `.trim();

    console.log('📤 最終提示詞 finalPrompt:', finalPrompt);

    // 7. 傳送至 Groq 模型
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: "user", content: finalPrompt }]
      }),
    });

    const groqData = await groqResponse.json();
    const answer = groqData.choices?.[0]?.message?.content || '⚠ 無法取得回答';

    console.log('🗣️ Groq 回答摘要:', answer.substring(0, 80) + '...');

    // 如果 Groq 回答失敗，直接返回 Pinecone 答案
    if (answer === '⚠ 無法取得回答' && directAnswer && directAnswer !== '⚠ 無法從知識庫獲取回答') {
      return res.status(200).json({
        answer: `${directAnswer} (直接從知識庫提取)`,
        source: 'pinecone',
        debug: {
          query,
          pineconeMatches: matches
        }
      });
    }

    return res.status(200).json({
      answer,
      source: 'groq',
      debug: {
        query,
        prompt: finalPrompt,
        pineconeMatches: matches
      }
    });

  } catch (error) {
    console.error('❌ 發生錯誤:', error);
    return res.status(200).json({
      answer: `⚠ 系統錯誤：${error.message}`,
      debug: { error: error.message }
    });
  }
}
