// /pages/api/search.js
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

  const { queryVector } = req.body;

  try {
    const response = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    res.status(200).json({ matches: response.matches });
  } catch (error) {
    console.error('Pinecone query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
