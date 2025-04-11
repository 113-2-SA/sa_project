// components/Chat.js
import { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; text: string }[]>([]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    // 發送訊息後，將訊息加入聊天記錄
    const newMessage = { user: 'me', text: message };
    setChatHistory([...chatHistory, newMessage]);

    // 模擬回復訊息
    setTimeout(() => {
      const replyMessage = { user: 'bot', text: '這是回復的訊息' };
      setChatHistory((prev) => [...prev, replyMessage]);
    }, 1000);

    setMessage('');
  };

  return (
    <div>
      <div
        className="chat-window mx-auto"
        style={{
          width: '100%', // 將寬度改為占螢幕的 100%
          maxWidth: '800px', // 設定最大寬度以保持美觀
          height: '50vh', // 調整高度以適應畫面
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: '#f8f9fa',
          margin: '10px auto', // 減少與標題的間距
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {/* 顯示聊天記錄 */}
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 my-1 rounded-lg max-w-[70%] ${
              msg.user === 'me' ? 'self-end bg-blue-100 text-right' : 'self-start bg-gray-200 text-left'
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '10px', // 減少輸入框與聊天記錄框的間距
          width: '100%', // 輸入框與按鈕的寬度也改為 90%
          maxWidth: '800px',
          margin: '0 auto', // 水平置中
          alignItems: 'center',
        }}
      >
        <input
          placeholder="Type your question..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <button
          className="button"
          onClick={handleSendMessage}
          style={{
            padding: '12px 24px',
          }}
        >
          送出
        </button>
      </div>
    </div>
  );
};

export default Chat;