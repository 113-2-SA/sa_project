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