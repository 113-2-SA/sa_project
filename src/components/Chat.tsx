// Chat 組件 - 支援教授資料 + Posts資料 + RAG檢索聊天
import { auth, db } from '@/_firebase/Config';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

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
  onChatUpdate?: () => void;  // 新增對話更新的回調函數
}

const Chat = ({ selectedChatId, onNewChat, onClearChat, onChatUpdate }: ChatProps) => {
  // 狀態管理
  const [message, setMessage] = useState(''); // 當前輸入的訊息
  const [chatHistory, setChatHistory] = useState<Message[]>([]); // 對話歷史記錄
  const [isLoading, setIsLoading] = useState(false); // 載入狀態
  const [professorData, setProfessorData] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(selectedChatId);
  const [postsData, setPostsData] = useState<PostItem[]>([]);

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

  // 抓取教授資料
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

    const fetchPostsData = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPostsData(data.data);
      } catch (error) {
        console.error('Error fetching posts data:', error);
      }
    };

    fetchProfessorData();
    fetchPostsData();
  }, []);

  // 建立 System Prompt
  const buildSystemPrompt = (professorData: string, selectedPostsData: string) => 
    `你是一個輔仁大學資訊管理學系的智能助理。
      你可以根據以下資料回答使用者問題：
      1.教授資訊（教授姓名、職稱、專長、聯絡方式、辦公室地點、開課總覽）
      2.貼文資訊與留言回應（如畢業條件、課程分享等）

      【教授資訊】
      ${professorData}
      【貼文與留言資訊】
      ${selectedPostsData}

    請以專業、友善的繁體中文口吻作答，並將回答整理得有條理。如果找不到資料，請誠實告知。`;

  // 處理發送訊息
  const handleSendMessage = async () => {
    if (!message.trim() || !professorData || postsData.length === 0) return;

    setChatHistory((prev) => [...prev, { user: 'me', text: message }]);
    setIsLoading(true);

    try {
      // 1. 先調用 /api/ask 進行 RAG 檢索
      let pineconeAnswer = '';
      
      try {
        const askResponse = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: message }),
        });

        console.log('RAG 檢索響應狀態:', askResponse.status);
        
        const askText = await askResponse.text();
        console.log('RAG 檢索原始響應:', askText);
        
        if (askResponse.ok && askText && askText.trim()) {
          try {
            const askData = JSON.parse(askText);
            if (askData && askData.answer) {
              pineconeAnswer = askData.answer;
              console.log('成功從知識庫獲取答案:', pineconeAnswer);
            } else {
              console.warn('ask.js 回傳的資料缺少 answer 欄位:', askData);
              pineconeAnswer = '資料中未提及';
            }
          } catch (e) {
            console.error('ask.js 回傳非 JSON:', askText, e);
            pineconeAnswer = '⚠ 無法解析知識庫回應，請稍後再試';
          }
        } else {
          console.error('ask.js 返回錯誤狀態:', askResponse.status, askText);
          pineconeAnswer = '⚠ 知識庫檢索服務暫時不可用，請稍後再試';
        }
      } catch (error) {
        console.error('RAG 檢索調用出錯:', error);
        pineconeAnswer = '⚠ 無法連接到知識庫，請稍後再試';
      }

      // 2. 處理 posts 數據
      const selectedPosts = postsData
        .map(post => `\nPost標題: ${post.title}\n內容: ${post.content}\n留言:\n${post.comments.map(c => '- ' + c.content).join('\n')}`)
        .join('\n\n');

      // 建立 System Prompt 並整合 RAG 結果
      const systemPrompt = buildSystemPrompt(professorData, selectedPosts);
      const enhancedSystemPrompt = `${systemPrompt}

【知識庫檢索結果】
${pineconeAnswer}
`;

      // 使用增強後的系統提示
      const messages = [
        { role: 'system', content: enhancedSystemPrompt }, // 這裡使用 enhancedSystemPrompt 而非 systemPrompt
        ...chatHistory.map(msg => ({
          role: msg.user === 'me' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message },
      ];

      console.log('向 Groq API 發送請求...');
      
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
          temperature: 0.7,
          max_tokens: 2048,
          presence_penalty: 0.2,
          frequency_penalty: 0.2,
        }),
      });

      const responseText = await response.text();
      console.log('Groq API 響應狀態:', response.status);
      
      if (!response.ok) {
        throw new Error(`Groq API Error: ${response.status} - ${responseText}`);
      }

      try {
        const data = JSON.parse(responseText);
        const botResponse = data.choices[0].message.content;
        setChatHistory((prev) => [...prev, { user: 'bot', text: botResponse }]);
        
        // 更新 Firebase 中的對話，添加機器人回應
        try {
          const user = auth.currentUser;
          if (user) {
            // 獲取當前對話的主題
            let topic = '';
            let isTimeBasedTopic = false;

            if (currentChatId) {
              // 如果是現有對話，獲取當前主題
              const chatDoc = doc(db, 'chats', currentChatId);
              const chatSnapshot = await getDoc(chatDoc);
              if (chatSnapshot.exists()) {
                const chatData = chatSnapshot.data();
                topic = chatData.topic || '';
                isTimeBasedTopic = chatData.isTimeBasedTopic || false;
              }
            }

            // 只有在沒有主題或是時間基礎主題時才生成新主題
            if (!topic || isTimeBasedTopic) {
              try {
                const topicPrompt = `請分析以下對話中是否包含明確的主題，若有，請回答主題名稱，並絕對不要加其他詞語，完全只回答該主題內容（回覆必須是不包含引號的格式，例如："董惟鳳資訊"、"資管系畢業學分數"；不可使用"明確的主題：董惟鳳資訊"、"明確的主題：資管系畢業學分數"）。如果沒有明確的主題或無法分析，請回答 "no_topic"。

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
                    model: "llama3-70b-8192",
                    messages: [{ role: 'user', content: topicPrompt }],
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
                } else {
                  isTimeBasedTopic = false;
                }
              } catch (error) {
                console.error('生成主題時發生錯誤:', error);
                // 如果生成主題失敗，使用時間作為主題
                const now = new Date();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hour = String(now.getHours()).padStart(2, '0');
                const minute = String(now.getMinutes()).padStart(2, '0');
                topic = `${month}/${day} ${hour}:${minute}`;
                isTimeBasedTopic = true;
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
              chatId: currentChatId || ''
            };

            if (currentChatId) {
              // 更新現有對話
              const chatDoc = doc(db, 'chats', currentChatId);
              await updateDoc(chatDoc, chatData);
              console.log('對話已更新到 Firebase');
              if (onChatUpdate) onChatUpdate(); // 通知父組件更新對話歷史
            } else {
              // 新增對話
              const newChatRef = await addDoc(chatRef, chatData);
              const newChatId = newChatRef.id;
              setCurrentChatId(newChatId); // 儲存新對話的 ID
              
              // 更新新建立的對話，加入其 ID
              const newChatDoc = doc(db, 'chats', newChatId);
              await updateDoc(newChatDoc, { chatId: newChatId });
              console.log('新對話已保存到 Firebase');
              
              // 通知父組件新對話已建立
              if (onNewChat) {
                onNewChat(newChatId);
              }
              if (onChatUpdate) onChatUpdate(); // 通知父組件更新對話歷史
            }
          }
        } catch (error) {
          console.error('保存完整對話到 Firebase 時發生錯誤:', error);
          // 即使發生錯誤，也嘗試保存對話
          try {
            const user = auth.currentUser;
            if (user) {
              const now = new Date();
              const month = String(now.getMonth() + 1).padStart(2, '0');
              const day = String(now.getDate()).padStart(2, '0');
              const hour = String(now.getHours()).padStart(2, '0');
              const minute = String(now.getMinutes()).padStart(2, '0');
              const fallbackTopic = `${month}/${day} ${hour}:${minute}`;

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
                topic: fallbackTopic,
                isTimeBasedTopic: true,
                chatId: currentChatId || ''
              };

              if (currentChatId) {
                const chatDoc = doc(db, 'chats', currentChatId);
                await updateDoc(chatDoc, chatData);
                if (onChatUpdate) onChatUpdate(); // 通知父組件更新對話歷史
              } else {
                const newChatRef = await addDoc(chatRef, chatData);
                const newChatId = newChatRef.id;
                setCurrentChatId(newChatId);
                const newChatDoc = doc(db, 'chats', newChatId);
                await updateDoc(newChatDoc, { chatId: newChatId });
                
                // 通知父組件新對話已建立
                if (onNewChat) {
                  onNewChat(newChatId);
                }
                if (onChatUpdate) onChatUpdate(); // 通知父組件更新對話歷史
              }
              console.log('錯誤發生後仍成功保存對話到 Firebase');
            }
          } catch (saveError) {
            console.error('錯誤發生後保存對話失敗:', saveError);
          }
        }

      } catch (error) {
        console.error('解析 Groq API 響應出錯:', error, responseText);
        throw new Error('無法解析 AI 回應，請稍後再試');
      }

    } catch (error) {
      console.error('詳細錯誤:', error);
      setChatHistory((prev) => [...prev, { 
        user: 'bot', 
        text: `發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`
      }]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault();
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

export default Chat;
