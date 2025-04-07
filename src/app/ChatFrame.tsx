// pages/api/chat.js
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { message } = req.body;
  
      // 這裡可以加入處理邏輯（例如與 LLM 溝通或回應固定訊息）
      const reply = `回應：${message}`;
  
      return res.status(200).json({ reply });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  