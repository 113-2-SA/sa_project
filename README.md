# 輔大資管系智能助理

這是一個使用 [Next.js](https://nextjs.org) 建立的專案，透過 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 啟動。

## 專案功能說明

### 爬蟲資料處理

#### 1. 教授資料爬蟲
- 爬取教授相關資訊並儲存為 JSON 格式
- 將處理後的資料存入 Pinecone 向量資料庫
- 確保資料的一致性和可重複使用性

#### 2. 貼文留言爬蟲
- 實現貼文留言的爬蟲功能
- 保存爬蟲結果供後續分析使用

### 資料處理優化
- 建議在 `src/utils` 下新增 `crawlerUtils.ts` 用於處理爬蟲相關的工具函數
- 新增 `pineconeUtils.ts` 用於處理 Pinecone 向量資料庫的操作
- 新增 `dataProcessingUtils.ts` 用於處理 JSON 資料的轉換和清理

### 專案結構優化
- 建議在 `src` 下新增 `types` 目錄，用於存放 TypeScript 型別定義
- 建議在 `src` 下新增 `constants` 目錄，用於存放常數配置
- 建議在 `src` 下新增 `services` 目錄，用於存放 API 服務相關程式碼

### 爬蟲功能優化
建議在 `src` 下新增 `crawlers` 目錄，分別存放：
- `professorCrawler.ts`：教授資料爬蟲
- `postCrawler.ts`：貼文留言爬蟲
- `crawlerConfig.ts`：爬蟲配置檔案

### 資料儲存優化