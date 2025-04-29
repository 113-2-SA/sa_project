This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


步驟	指令
確認 Python	python --version
建立虛擬環境	python -m venv venv
啟動虛擬環境	.\venv\Scripts\Activate.ps1
安裝必要套件	pip install pinecone cohere tqdm python-dotenv
建一鍵批次檔	run_process_qa.bat

如果未來你新增了新的 Python 套件（比如多裝了一個什麼新的 library），
記得可以用這條指令把目前環境裡的所有安裝套件輸出成新的 requirements.txt：

bash：
pip freeze > requirements.txt
# 這樣可以確保你的 requirements.txt 是最新最完整的哦！🚀

🎯 總結
requirements.txt	# 管理專案需要安裝的所有 Python 套件
pip install -r requirements.txt	# 一鍵安裝專案所有需要的套件

# FAQ 上傳與向量資料庫建置專案

## 📚 專案簡介

本專案(process_qa_slice.py)主要負責：
- 讀取本地的 FAQ 問答資料 (`QA_data.json`)
- 使用 [Cohere](https://cohere.ai/) API 將問題轉換為向量 (embeddings)
- 將轉換後的向量上傳到 [Pinecone](https://www.pinecone.io/) 向量資料庫
- 批次處理、進度可視化
- 自動管理環境變數與 API KEY

---

## 🏗️ 專案結構
sa_project/ ├── venv/ # 虛擬環境 (Python 3.11) ├── src/ │ ├── FAQ/ │ │ └── process_qa_slice.py │ └── utils/ # (可選擴充) 共用工具 ├── data/ │ └── QA_data.json # 問答原始資料 ├── config/ │ └── .env # 儲存 API 金鑰 (Cohere & Pinecone) ├── requirements.txt # 專案所需 Python 套件列表 ├── run_all.bat # 一鍵啟動批次檔 └── README.md # 專案說明文件

