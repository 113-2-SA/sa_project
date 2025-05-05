// Next.js API 路由文件，處理問答功能
import { Pinecone } from "@pinecone-database/pinecone"; // 導入 Pinecone 向量數據庫客戶端

// API 路由處理函數
export default async function handler(req, res) {
  // 檢查請求方法是否為 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 從請求主體中獲取查詢文本
  const { query } = req.body;
  
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({ 
      answer: '請提供有效的查詢文本',
      debug: { error: 'Empty or invalid query' }
    });
  }

  try {
    console.log('處理查詢:', query);
    
    // 1. 使用 Cohere API 將問題轉換為向量
    let queryVector;
    try {
      const embedResponse = await fetch('https://api.cohere.com/v1/embed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`, // Cohere API 認證
          'Content-Type': 'application/json',
          'Cohere-Version': '2022-12-06'  // 添加 API 版本號
        },
        body: JSON.stringify({
          model: 'embed-multilingual-light-v3.0',  // 使用多語言模型與 embed.js 統一使用相同模型
          texts: [query],  // 將查詢文本轉換為向量使用 'texts' 而非 'input'
          input_type: 'search_query',
          truncate: 'END'
        }),
      });

      if (!embedResponse.ok) {
        const errorText = await embedResponse.text();
        console.error('Cohere API 錯誤:', errorText);
        return res.status(500).json({
          answer: '⚠ 嵌入向量生成失敗，請稍後再試',
          debug: { error: 'Embedding generation failed' }
        });
      }

      // 解析 Cohere API 的響應
      const embedData = await embedResponse.json();
      if (!embedData.embeddings || !embedData.embeddings[0]) {
        console.error('Cohere 返回無效嵌入向量:', embedData);
        return res.status(500).json({
          answer: '⚠ 無法生成查詢向量，請稍後再試',
          debug: { error: 'Invalid embedding response' }
        });
      }

      queryVector = embedData.embeddings[0];  // 獲取查詢文本的向量表示
      console.log('生成的查詢向量 (前5個元素):', queryVector.slice(0, 5));
    } catch (embedError) {
      console.error('嵌入向量生成錯誤:', embedError);
      return res.status(500).json({
        answer: '⚠ 嵌入向量生成過程中發生錯誤，請稍後再試',
        debug: { error: embedError.message }
      });
    }

    // 2. 使用向量在 Pinecone 中搜索相似內容
    // test-pinecone.js
require('dotenv').config(); // 確保能夠讀取 .env 文件
const { Pinecone } = require('@pinecone-database/pinecone');

// 打印環境變數 (隱藏完整 API 密鑰)
console.log('環境變數檢查:');
console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? '存在 (已隱藏前5位後的部分)' : '不存在');
console.log('PINECONE_ENV:', process.env.PINECONE_ENV);
console.log('PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME);

// 測試兩種不同的連接方式
async function testConnection() {
  console.log('\n===== 測試 Pinecone 連接 =====');
  
  // 嘗試方法 1: 使用 controllerHostUrl
  try {
    console.log('\n方法 1: 使用 controllerHostUrl');
    const controllerUrl = `https://${process.env.PINECONE_INDEX_NAME}-${process.env.PINECONE_ENV}.svc.${process.env.PINECONE_ENV}.pinecone.io`;
    console.log('使用的 controllerHostUrl:', controllerUrl);
    
    const pinecone1 = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      controllerHostUrl: controllerUrl,
    });
    
    const index1 = pinecone1.Index(process.env.PINECONE_INDEX_NAME);
    const stats1 = await index1.describeIndexStats();
    console.log('方法 1 連接成功! 索引狀態:', stats1);
  } catch (error) {
    console.error('方法 1 連接失敗:', error.message);
    console.error('完整錯誤:', error);
  }
  
  // 嘗試方法 2: 使用 environment
  try {
    console.log('\n方法 2: 使用 environment');
    console.log('使用的 environment:', process.env.PINECONE_ENV);
    
    const pinecone2 = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENV,
    });
    
    const index2 = pinecone2.Index(process.env.PINECONE_INDEX_NAME);
    const stats2 = await index2.describeIndexStats();
    console.log('方法 2 連接成功! 索引狀態:', stats2);
  } catch (error) {
    console.error('方法 2 連接失敗:', error.message);
    console.error('完整錯誤:', error);
  }
  
  // 嘗試方法 3: 不指定 environment 或 controllerHostUrl
  try {
    console.log('\n方法 3: 只使用 apiKey');
    
    const pinecone3 = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    const index3 = pinecone3.Index(process.env.PINECONE_INDEX_NAME);
    const stats3 = await index3.describeIndexStats();
    console.log('方法 3 連接成功! 索引狀態:', stats3);
  } catch (error) {
    console.error('方法 3 連接失敗:', error.message);
  }
}

// 嘗試使用 fetch API 直接訪問 Pinecone REST API
async function testDirectApi() {
  console.log('\n===== 測試直接使用 REST API =====');
  try {
    const url = `https://${process.env.PINECONE_INDEX_NAME}-${process.env.PINECONE_ENV}.svc.${process.env.PINECONE_ENV}.pinecone.io/describe_index_stats`;
    console.log('直接調用 REST API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Api-Key': process.env.PINECONE_API_KEY,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('REST API 調用成功:', data);
  } catch (error) {
    console.error('REST API 調用失敗:', error.message);
  }
}

// 執行測試
async function runTests() {
  await testConnection();
  await testDirectApi();
}

runTests().catch(console.error);

    // 更嚴謹地從 metadata 中提取資料
    const contexts = matches.map((match, i) => {
      // 檢查 metadata 是否存在
      const metadata = match.metadata || {};
      console.log(`匹配項 ${i+1} 的 metadata:`, metadata);

      // 優先嘗試獲取 answer 欄位，如果不存在則使用 text 欄位，如果兩者都不存在則使用空字串
      const content = metadata.answer || metadata.text || '';
      return `${i + 1}. ${content}`;
    }).filter(item => item.length > 4).join('\n'); // 過濾掉空白或過短的內容
    console.log('提取的上下文:', contexts);

    // 檢查提取出的上下文是否有效
    if (!contexts || contexts.trim() === '') {
      console.log('提取的上下文為空');
      return res.status(200).json({
        answer: '雖然找到了相關資料，但無法提取有效內容。我是輔仁大學資訊管理學系的助理，可以回答關於教授、課程和系上活動的問題。請問還有什麼我能幫您的嗎？',
        debug: { query, prompt: '查詢結果中缺少有效內容', matches }
      });
    }

    // 3. 構建提示詞
    const finalPrompt = `
你是一個輔仁大學資訊管理學系的助理，根據以下資料回答問題。如果資料中沒有答案，請誠實回答不知道。

資料如下：
${contexts || "查無相關資料"}

使用這些資料來回答這個問題：
${query}
請以條列清楚、有邏輯、誠實回答。若無資料，請說「資料中未提及」。
`;
    console.log('最終提示詞:', finalPrompt);  // 輸出最終提示詞以進行調試

    // 4. 使用 Groq API 生成回答
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,  // Groq API 認證
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',  // 使用 Llama 3 模型
          messages: [
            { role: "user", content: finalPrompt }  // 設置對話內容
          ]
        }),
      });

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('Groq API 錯誤:', errorText);
        return res.status(200).json({
          answer: '⚠ 回答生成服務暫時無法使用，但我找到了以下相關資訊：\n\n' + contexts,
          debug: { error: 'Groq API error' }
        });
      }

      // 解析 Groq API 的響應
      const groqData = await groqResponse.json();
      const answer = groqData.choices?.[0]?.message?.content || '⚠ 無法取得答案';
      console.log('Groq生成的回答:', answer.substring(0, 100) + '...');

      // 返回結果，包含調試信息
      res.status(200).json({
        answer,
        debug: {
          query,          // 原始查詢
          prompt: finalPrompt,  // 使用的提示詞
          matches
        }
      });
    } catch (groqError) {
      console.error('Groq API 錯誤:', groqError);
      return res.status(200).json({
        answer: '⚠ 回答生成服務暫時無法使用，但我找到了以下相關資訊：\n\n' + contexts,
        debug: { error: groqError.message }
      });
    }
    
  } catch (error) {
    // 錯誤處理
    console.error('Ask API error:', error);  // 輸出錯誤信息
    res.status(200).json({ 
      answer: `⚠ 系統處理過程中發生錯誤，請稍後再試。錯誤詳情：${error.message}`,
      error: error.message
      
    });  // 返回錯誤響應，但使用 200 狀態碼以確保前端能夠解析
  }
}

