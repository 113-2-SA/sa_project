import { pipeline } from '@xenova/transformers'

// 模型只會下載一次
let embedder: any = null

export async function getEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }

  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true
  })

  return Array.from(output.data)
}
