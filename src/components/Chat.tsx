// Chat 組件 - 實現即時對話功能
import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';

// 定義訊息介面
interface Message {
  user: 'me' | 'bot';
  text: string;
}

// 系統提示詞模板
const SYSTEM_PROMPT_TEMPLATE = (professorData: string) => `你是一個專門回答關於輔仁大學資訊管理學系教師資訊的助手。
你可以回答關於教師的以下問題：
1. 教師的基本資訊（姓名、職稱）
2. 教師的專長領域
3. 教師的聯絡方式（電話、email）
4. 教師的辦公室位置

請根據以下教師資料回答問題：

${professorData}

請用中文回答問題，保持專業和友善的態度。如果問題超出上述資料範圍，請誠實告知無法回答。`;

const Chat = () => {
  // 狀態管理
  const [message, setMessage] = useState(''); // 當前輸入的訊息
  const [chatHistory, setChatHistory] = useState<Message[]>([]); // 對話歷史記錄
  const [isLoading, setIsLoading] = useState(false); // 載入狀態
  const [professorData, setProfessorData] = useState('');

  // 在組件載入時獲取教師資料
  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch('/api/professors');
        const data = await response.json();
        setProfessorData(data.data);
      } catch (error) {
        console.error('Error fetching professor data:', error);
      }
    };

    fetchProfessorData();
  }, []);

  // 處理發送訊息的函數
  const handleSendMessage = async () => {
    if (!message.trim() || !professorData) return;

    // 添加用戶訊息到對話歷史
    setChatHistory((prev) => [...prev, { user: 'me', text: message }]);
    setIsLoading(true);

    try {
      console.log('Sending request to Groq API...');
      
      // 準備完整的對話歷史記錄，包含系統提示詞
      const messages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT_TEMPLATE(professorData)
        },
        // 將之前的對話歷史轉換為 API 所需格式
        ...chatHistory.map(msg => ({
          role: msg.user === 'me' ? 'user' : 'assistant',
          content: msg.text
        })),
        // 加入當前用戶的新訊息
        {
          role: 'user',
          content: message,
        }
      ];

      // 發送請求到 Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: messages,
          temperature: 0.7, // 控制回答的創造性
          max_tokens: 2048, // 最大回應長度
          presence_penalty: 0.2,  // 增加回答的多樣性
          frequency_penalty: 0.2, // 減少重複內容
        }),
      });

      // 記錄 API 回應狀態和內容
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      // 檢查 API 回應是否成功
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseText}`);
      }

      // 解析 API 回應並更新對話歷史
      const data = JSON.parse(responseText);
      const botResponse = data.choices[0].message.content;
      setChatHistory((prev) => [...prev, { user: 'bot', text: botResponse }]);

    } catch (error: any) {
      // 錯誤處理
      console.error('Detailed error:', error);
      setChatHistory((prev) => [
        ...prev,
        { user: 'bot', text: `Error: ${error?.message || 'Unknown error occurred'}. Please try again.` },
      ]);
    } finally {
      // 重設狀態
      setIsLoading(false);
      setMessage('');
    }
  };

  // 處理鍵盤事件 - Enter 發送訊息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  async function askQuestion(input: string) {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    });
  
    const data = await response.json();
    console.log(data.answer);
  }
  

  // 渲染聊天界面
  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* 聊天視窗 */}
      <div
        className="chat-window mx-auto flex-1"
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '400px',
          /*overflowY: 'auto',*/
          overflowY: 'scroll',
          overflowX: 'hidden',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: '#f8f9fa',
          margin: '20px auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {/* 顯示對話歷史 */}
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 my-1 rounded-lg max-w-[70%] ${
              msg.user === 'me' ? 'self-end bg-blue-100 text-right' : 'self-start bg-gray-200 text-left'
            }`}
          >
            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
          </div>
        ))}
        {/* 載入中提示 */}
        {isLoading && (
          <div className="self-start bg-gray-100 text-gray-500 p-2 rounded-lg">
            思考中... 🤔
          </div>
        )}
      </div>
      {/* 輸入區域 */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '10px',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          alignItems: 'center',
        }}
      >
        {/* 輸入框 */}
        <input
          placeholder="輸入你的問題..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        {/* 發送按鈕 */}
        <button
          className="button"
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          送出
        </button>
      </div>
    </div>
  );
};

export default Chat;