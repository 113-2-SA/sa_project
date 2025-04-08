// components/Chat.js
import { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; text: string }[]>([]);

  const handleSendMessage = () => {
    // 發送訊息後，將訊息加入聊天記錄
    const newMessage = { user: 'me', text: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
  };

  return (
    <div>
      <div className="chat-window"
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '70vh',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: '#f8f9fa',
          margin: '0 auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
        {/* 顯示聊天記錄 */}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={msg.user === 'me' ? 'user-msg' : 'other-msg'}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '20px',
        width: '100%',
        maxWidth: '800px',
        margin: '20px auto',
        alignItems: 'center', // 確保輸入框與按鈕垂直置中
        position: 'relative' // 為提示字提供定位基準
      }}>
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
            marginTop: '20px' // 確保不與提示字重疊
          }}
        />
        <button 
          className='button' 
          onClick={handleSendMessage}
          style={{
            padding: '12px 24px',
            marginTop: '20px' // 與輸入框保持一致
          }}
        >
          送出
        </button>
      </div>
    </div>
  );
};

export default Chat;
