import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'your_project_id', // 替換為你的 Sanity 專案 ID
  dataset: 'your_dataset', // 替換為你的資料集名稱 (例如 'production')
  apiVersion: '2023-01-01', // 使用你需要的 API 版本
  useCdn: false, // 如果需要即時資料，設為 false
});

export default sanityClient;