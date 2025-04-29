// import { importFromCSV, importFromJSON, importFromTextFiles, importFromWebPages } from '../utils/dataImport';
// const { PineconeClient } = require('@pinecone-database/pinecone');

// async function main() {
//   try {
//     // 從 CSV 文件導入
//     console.log('從 CSV 文件導入數據...');
//     const csvCount = await importFromCSV('./data/your-data.csv');
//     console.log(`成功導入 ${csvCount} 條 CSV 記錄`);

//     // 從 JSON 文件導入
//     console.log('\n從 JSON 文件導入數據...');
//     const jsonCount = await importFromJSON('./data/your-data.json');
//     console.log(`成功導入 ${jsonCount} 條 JSON 記錄`);
//     // Initialize Pinecone connection
//     console.log('\n初始化 Pinecone...');
//     const pinecone = new PineconeClient();
//     await pinecone.init({
//       environment: 'your-environment',  // from Pinecone console
//       apiKey: 'your-api-key'           // from Pinecone console
//     });

//     // Get index
//     const index = pinecone.Index('your-index-name');

//     // Convert imported data to vectors and upsert to Pinecone
//     // You'll need to implement vectorization of your data
//     const vectors = []; // Convert your imported data to vectors
//     await index.upsert({
//       upsertRequest: {
//       vectors: vectors
//       }
//     });
//     console.log('數據已成功存儲到 Pinecone');
//     // 從文本文件夾導入
//     console.log('\n從文本文件導入數據...');
//     const txtCount = await importFromTextFiles('./data/txt-files');
//     console.log(`成功導入 ${txtCount} 條文本記錄`);

//     // 從網頁導入
//     console.log('\n從網頁導入數據...');
//     const urls = [
//       'https://example.com/page1',
//       'https://example.com/page2'
//     ];
//     const webCount = await importFromWebPages(urls);
//     console.log(`成功導入 ${webCount} 條網頁記錄`);

//   } catch (error) {
//     console.error('導入過程中發生錯誤:', error);
//   }
// }

// main(); 