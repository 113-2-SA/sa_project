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
      <div className="chat-window">
        {/* 顯示聊天記錄 */}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={msg.user === 'me' ? 'user-msg' : 'other-msg'}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <input
        className='space-x-2'
        placeholder="Type your question..."
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className='button' onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
