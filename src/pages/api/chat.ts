// import { getEmbedding } from '@/lib/getEmbedding'
// // 這個 API 用來處理用戶的問題，並將問題和回答儲存到 Firebase
// // 以及查詢 Pinecone 資料庫
// process.env.TF_CPP_MIN_LOG_LEVEL = '2' // 避免 tfjs 警告


// import type { NextApiRequest, NextApiResponse } from 'next'
// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, addDoc } from 'firebase/firestore'
// import { Pinecone } from '@pinecone-database/pinecone'
// import axios from 'axios'

// // 1. 初始化 Firebase
// const firebaseConfig = {
//   apiKey: '你的APIKEY',
//   authDomain: '你的DOMAIN',
//   projectId: '你的PROJECT_ID',
//   storageBucket: '',
//   messagingSenderId: '',
//   appId: ''
// }

// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app)

// // 2. 初始化 Pinecone
// const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
// const index = pinecone.Index('你的索引名稱')

// // 3. 對 Groq 發送請求 (LLaMA 3.1)
// async function callGroqChat(message: string, context: string) {
//   const res = await axios.post(
//     'https://api.groq.com/openai/v1/chat/completions',
//     {
//       model: 'llama3-8b-8192',
//       messages: [
//         { role: 'system', content: '你是一個根據知識資料回答問題的助理。' },
//         { role: 'user', content: `根據以下資料回答問題：\n${context}\n\n問題：${message}` }
//       ]
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     }
//   )
//   return res.data.choices[0].message.content
// }

// // 4. 查詢 Pinecone
// async function queryPinecone(userQuery: string): Promise<string[]> {
//   // 用 OpenAI 或 HuggingFace 轉向量，這裡你需使用你支援的 embedding 工具
//   const embedding = await getEmbedding(userQuery) // 你需要實作這個函數
//   const result = await index.query({
//     topK: 3,
//     vector: embedding,
//     includeMetadata: true
//   })
//   return result.matches.map(match => match.metadata.text)
// }

// // 5. API handler
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { userId, message } = req.body

//   const relatedTexts = await queryPinecone(message)
//   const context = relatedTexts.join('\n')

//   const answer = await callGroqChat(message, context)

//   // 儲存對話到 Firebase
//   await addDoc(collection(db, 'chats'), {
//     userId,
//     timestamp: Date.now(),
//     question: message,
//     answer
//   })

//   res.status(200).json({ answer })
// }
