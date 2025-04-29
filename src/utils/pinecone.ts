import { HfInference } from '@huggingface/inference';
import { Pinecone } from '@pinecone-database/pinecone';

// 定義回傳結果的介面
interface SearchResult {
  score?: number;
  content?: string;
}

interface PineconeMatch {
  score?: number;
  metadata?: {
    content?: string;
  };
}

// 初始化 Hugging Face 客戶端
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
  environment: process.env.PINECONE_ENVIRONMENT || '',
});

// 將文本轉換為向量
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    // 使用 Hugging Face 的 sentence-transformers 模型
    const response = await hf.featureExtraction({
      model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
      inputs: text
    });
    
    // 處理不同的回傳格式
    if (Array.isArray(response) && response.every(item => typeof item === 'number')) {
      return response as number[];
    } else if (Array.isArray(response) && Array.isArray(response[0])) {
      return response[0] as number[];
    } else if (typeof response === 'number') {
      return [response];
    }

    throw new Error('無效的向量格式');
  } catch (error) {
    console.error('生成向量時發生錯誤:', error);
    throw error;
  }
}

// 搜尋相似向量
export async function searchSimilarVectors(query: string, topK: number = 3): Promise<SearchResult[]> {
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || '');
  const queryEmbedding = await getEmbedding(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return results.matches.map((match: PineconeMatch) => ({
    score: match.score,
    content: match.metadata?.content,
  }));
}

// 將文本資料插入向量資料庫
export async function upsertVectors(documents: { id: string; content: string }[]) {
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || '');
  
  for (const doc of documents) {
    const embedding = await getEmbedding(doc.content);
    await index.upsert([{
      id: doc.id,
      values: embedding,
      metadata: {
        content: doc.content,
      },
    }]);
  }
} 