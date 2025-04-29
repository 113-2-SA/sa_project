// import csv from 'csv-parser';
// import fs from 'fs';
// import path from 'path';
// import { upsertVectors } from './pinecone';

// // 從 CSV 文件導入數據
// export async function importFromCSV(filePath: string) {
//   const results: { id: string; content: string }[] = [];
  
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => {
//         // 假設 CSV 文件有 'id' 和 'content' 列
//         results.push({
//           id: data.id || String(results.length + 1),
//           content: data.content
//         });
//       })
//       .on('end', async () => {
//         try {
//           // 批次處理，每次處理 100 條記錄
//           const batchSize = 100;
//           for (let i = 0; i < results.length; i += batchSize) {
//             const batch = results.slice(i, i + batchSize);
//             await upsertVectors(batch);
//             console.log(`已處理 ${i + batch.length} / ${results.length} 條記錄`);
//           }
//           resolve(results.length);
//         } catch (error) {
//           reject(error);
//         }
//       })
//       .on('error', (error) => {
//         reject(error);
//       });
//   });
// }

// // 從 JSON 文件導入數據
// export async function importFromJSON(filePath: string) {
//   try {
//     const fileContent = await fs.promises.readFile(filePath, 'utf8');
//     const data = JSON.parse(fileContent);
    
//     // 確保數據格式正確
//     const documents = Array.isArray(data) ? data : [data];
//     const formattedData = documents.map((doc, index) => ({
//       id: doc.id || String(index + 1),
//       content: doc.content
//     }));

//     // 批次處理
//     const batchSize = 100;
//     for (let i = 0; i < formattedData.length; i += batchSize) {
//       const batch = formattedData.slice(i, i + batchSize);
//       await upsertVectors(batch);
//       console.log(`已處理 ${i + batch.length} / ${formattedData.length} 條記錄`);
//     }

//     return formattedData.length;
//   } catch (error) {
//     throw new Error(`JSON 導入錯誤: ${error.message}`);
//   }
// }

// // 從文本文件夾批量導入
// export async function importFromTextFiles(folderPath: string) {
//   try {
//     const files = await fs.promises.readdir(folderPath);
//     const textFiles = files.filter(file => file.endsWith('.txt'));
//     const documents: { id: string; content: string }[] = [];

//     for (const file of textFiles) {
//       const content = await fs.promises.readFile(
//         path.join(folderPath, file),
//         'utf8'
//       );
//       documents.push({
//         id: file.replace('.txt', ''),
//         content: content.trim()
//       });
//     }

//     // 批次處理
//     const batchSize = 100;
//     for (let i = 0; i < documents.length; i += batchSize) {
//       const batch = documents.slice(i, i + batchSize);
//       await upsertVectors(batch);
//       console.log(`已處理 ${i + batch.length} / ${documents.length} 條記錄`);
//     }

//     return documents.length;
//   } catch (error) {
//     throw new Error(`文本文件導入錯誤: ${error.message}`);
//   }
// }

// // 從網頁抓取數據
// export async function importFromWebPages(urls: string[]) {
//   try {
//     const documents: { id: string; content: string }[] = [];
    
//     for (const [index, url] of urls.entries()) {
//       try {
//         const response = await fetch(url);
//         const html = await response.text();
        
//         // 使用簡單的方法提取文本（實際使用時可能需要更複雜的處理）
//         const text = html.replace(/<[^>]*>/g, ' ')  // 移除 HTML 標籤
//                         .replace(/\s+/g, ' ')       // 將多個空格合併為一個
//                         .trim();
        
//         documents.push({
//           id: `webpage-${index + 1}`,
//           content: text
//         });
//       } catch (error) {
//         console.error(`抓取 ${url} 失敗:`, error);
//       }
//     }

//     // 批次處理
//     const batchSize = 100;
//     for (let i = 0; i < documents.length; i += batchSize) {
//       const batch = documents.slice(i, i + batchSize);
//       await upsertVectors(batch);
//       console.log(`已處理 ${i + batch.length} / ${documents.length} 條記錄`);
//     }

//     return documents.length;
//   } catch (error) {
//     throw new Error(`網頁抓取錯誤: ${error.message}`);
//   }
// } 