// /pages/api/embed.js
export default async function handler(req, res) {
    const { text } = JSON.parse(req.body);
  
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'embed-multilingual-light-v3.0',
        input: [text], // 注意 Cohere 要包成 list
      }),
    });
  
    const data = await response.json();
    res.status(200).json({ embedding: data.embeddings[0] }); // 取第0個
  }
  