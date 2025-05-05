// 這個檔案是用來處理 Gummy Chat 的組件，包含了對話的顯示、輸入和發送功能。
import { auth, db } from '@/_firebase/Config';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import OpenAI from "openai";

interface Message {
  user: 'me' | 'bot';
  text: string;
}

interface PostItem {
  id: string;
  title: string;
  content: string;
  comments: { content: string }[];
}

interface ChatProps {
  selectedChatId: string | null;
  onNewChat?: (chatId: string) => void;  // 新增回調函數
  onClearChat?: () => void;  // 新增清空對話的回調函數
}



const gummyChat = ({ selectedChatId, onNewChat, onClearChat }: ChatProps) => {
  // 狀態管理
  const [message, setMessage] = useState(''); // 當前輸入的訊息
  const [chatHistory, setChatHistory] = useState<Message[]>([]); // 對話歷史記錄
  const [isLoading, setIsLoading] = useState(false); // 載入狀態
  const [professorData, setProfessorData] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(selectedChatId);

  // 當 selectedChatId 改變時更新 currentChatId 和載入對話內容
  useEffect(() => {
    setCurrentChatId(selectedChatId);
    
    const loadChatHistory = async () => {
      if (selectedChatId) {
        try {
          const chatDoc = doc(db, 'chats', selectedChatId);
          const chatSnapshot = await getDoc(chatDoc);
          
          if (chatSnapshot.exists()) {
            const chatData = chatSnapshot.data();
            const messages = chatData.messages.map((msg: any) => ({
              user: msg.user,
              text: msg.text
            }));
            setChatHistory(messages);
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      } else {
        // 如果是新對話，清空歷史記錄
        setChatHistory([]);
        setMessage('');
        if (onClearChat) {
          onClearChat();
        }
      }
    };

    loadChatHistory();
  }, [selectedChatId, onClearChat]);

//   抓取教授資料
  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch('/api/professors');//professors.ts
        const data = await response.json();
        setProfessorData(data.data);
      } catch (error) {
        console.error('Error fetching professor data:', error);
      }
    };

    fetchProfessorData();

  }, []);

  // 建立 System Prompt
  const buildSystemPrompt = (professorData: string) => 
    `你是一個給予資管系學生情緒安慰的助理，你的態度親切樂觀，
      
    當使用者表達困難或情緒波動時，請根據以下原則提供回應：
        1. 傾聽與理解：首先表達你理解他們的情緒，如「我能理解你現在的感受」。
        2. 提供安慰與鼓勵：用積極、溫暖的語言安慰他們，例如「你並不孤單，一切會好起來」。
        3. 避免提供過度簡化的解決方案：避免給予過於理性或指導性的建議，而是更多地提供情感上的支持。
        4. 引導回正向情緒：在適當的情況下，幫助使用者重新聚焦於積極的事情，並鼓勵他們相信未來會更好。

    請以友善的繁體中文口吻作答。如果使用者表達較為嚴重的情緒問題（如焦慮症、抑鬱等），請引導他們尋求專業人員或教師的幫助，並給予適當的建議。
    如果使用者向你主動詢問教師聯絡方式再根據 ${professorData} 告訴使用者。`;

  // 處理發送訊息
  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    setChatHistory((prev) => [...prev, { user: 'me', text: message }]);
    setIsLoading(true);

    try {
     
      const systemPrompt = buildSystemPrompt(professorData);

      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.user === 'me' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message },
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: "gemma2-9b-it",
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048,
          presence_penalty: 0.2,
          frequency_penalty: 0.2,
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      const botResponse = data.choices[0].message.content;
      setChatHistory((prev) => [...prev, { user: 'bot', text: botResponse }]);

      // 更新 Firebase 中的對話，添加機器人回應
      try {
        const user = auth.currentUser;
        if (user) {
          let topic = '';
          let isTimeBasedTopic = false;

          // 如果是新對話或現有對話的主題是基於時間的，才進行問題判定
          if (!currentChatId) {
            // 判斷對話主題
            const topicPrompt = `請以使用者的訊息做簡短的摘要當作標題。如果對話沒有明確的問題或無法分析，請回答 "no_topic"。

            對話內容：${message}

            請用繁體中文回答，如果使用者沒有問明確的問題，請只回答 "no_topic"。`;
            
            const topicResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: 'user', content: topicPrompt },
                ],
                temperature: 0.3,
                max_tokens: 10,
              }),
            });

            const topicData = await topicResponse.json();
            topic = topicData.choices[0].message.content.trim();

            // 如果沒有明確主題，使用當前時間作為主題
            if (topic === "no_topic") {
              const now = new Date();
              const month = String(now.getMonth() + 1).padStart(2, '0');
              const day = String(now.getDate()).padStart(2, '0');
              const hour = String(now.getHours()).padStart(2, '0');
              const minute = String(now.getMinutes()).padStart(2, '0');
              topic = `${month}/${day} ${hour}:${minute}`;
              isTimeBasedTopic = true;
            }
          } else {
            // 如果是現有對話，獲取當前主題和 isTimeBasedTopic 狀態
            const chatDoc = doc(db, 'chats', currentChatId);
            const chatSnapshot = await getDoc(chatDoc);
            if (chatSnapshot.exists()) {
              const chatData = chatSnapshot.data();
              topic = chatData.topic;
              isTimeBasedTopic = chatData.isTimeBasedTopic;
            }
          }

          const chatRef = collection(db, 'chats');
          const chatData = {
            userEmail: user.email,
            messages: chatHistory.concat([
              { user: 'me', text: message },
              { user: 'bot', text: botResponse }
            ]),
            timestamp: serverTimestamp(),
            lastMessage: message,
            lastResponse: botResponse,
            lastMessageTime: new Date().toISOString(),
            topic: topic,
            isTimeBasedTopic: isTimeBasedTopic,
            chatId: currentChatId || '' // 新增：儲存對話 ID
          };

          if (currentChatId) {
            // 更新現有對話
            const chatDoc = doc(db, 'chats', currentChatId);
            await updateDoc(chatDoc, chatData);
            console.log('對話已更新到 Firebase');
          } else {
            // 新增對話
            const newChatRef = await addDoc(chatRef, chatData);
            const newChatId = newChatRef.id;
            setCurrentChatId(newChatId); // 儲存新對話的 ID
            
            // 更新新建立的對話，加入其 ID
            const newChatDoc = doc(db, 'chats', newChatId);
            await updateDoc(newChatDoc, { chatId: newChatId });
            console.log('新對話已保存到 Firebase');
            
            // 通知父組件有新對話產生
            if (onNewChat) {
              onNewChat(newChatId);
            }
          }
        }
      } catch (error) {
        console.error('保存完整對話到 Firebase 時發生錯誤:', error);
      }

    } catch (error: any) {
      console.error('Detailed error:', error);
      setChatHistory((prev) => [...prev, { user: 'bot', text: `Error: ${error?.message || 'Unknown error'}` }]);
    } finally {
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

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="chat-window mx-auto flex-1" style={{ width: '100%', maxWidth: '800px', maxHeight: '400px', overflowY: 'scroll', overflowX: 'hidden', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', backgroundColor: '#f8f9fa', margin: '20px auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`p-2 my-1 rounded-lg max-w-[70%] ${msg.user === 'me' ? 'self-end bg-blue-100 text-right' : 'self-start bg-gray-200 text-left'}`}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="self-start bg-gray-100 text-gray-500 p-2 rounded-lg">思考中... 🤔</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', width: '100%', maxWidth: '800px', margin: '0 auto', alignItems: 'center' }}>
        <input
          placeholder="輸入你的問題..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <button
          className="button"
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{ padding: '12px 24px', opacity: isLoading ? 0.7 : 1 }}
        >
          送出
        </button>
      </div>
    </div>
  );
};

export default gummyChat;
