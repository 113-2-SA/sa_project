import { Pinecone } from '@pinecone-database/pinecone';
import type { NextApiRequest, NextApiResponse } from 'next';

const pinecone = new Pinecone({ 
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!
});

const index = pinecone.index('faq-embeddings'); // 請替換為您的索引名稱

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { vector } = req.body;

    if (!vector || !Array.isArray(vector)) {
      return res.status(400).json({ error: '請提供有效的向量資料。' });
    }

    const queryResponse = await index.query({
    vector,
      topK: 5,
      includeMetadata: true,
    });

    res.status(200).json({ matches: queryResponse.matches });
  } catch (error) {
    console.error('查詢錯誤：', error);
    res.status(500).json({ error: '查詢失敗，請稍後再試。' });
  }
}
