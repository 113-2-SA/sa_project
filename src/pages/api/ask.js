// /pages/api/ask.js
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.body;

  try {
    // 1. 先用 Cohere 把問題轉成向量
    const embedResponse = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'embed-multilingual-light-v3.0',
        input: [query],
      }),
    });

    const embedData = await embedResponse.json();
    const queryVector = embedData.embeddings[0];

    // 2. 用向量去 Pinecone 查資料
    const pineconeResponse = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    const contexts = pineconeResponse.matches.map(
      (match, idx) => `${idx + 1}. ${match.metadata.text || match.metadata.content}`
    ).join('\n');

    // 3. 組成 prompt
    const finalPrompt = `
你是個專業助理，根據以下資料回答問題。如果資料中沒有答案，請誠實回答不知道。

已知資料：
1. [第一筆資料內容]
2. [第二筆資料內容]
3. [第三筆資料內容]
...

使用這些資料來回答這個問題：
[使用者的問題]


已知資料：
${contexts}

使用這些資料來回答這個問題：
${query}
`;

    // 4. 丟給 Groq Llama3
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // 這是 llama-3.1-8b-instant 的 model id
        messages: [
          { role: "user", content: finalPrompt }
        ]
      }),
    });

    const groqData = await groqResponse.json();

    const answer = groqData.choices[0].message.content;

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Ask API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
