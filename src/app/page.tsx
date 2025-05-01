'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from '../components/Chat';
import { auth } from "../_firebase/Config";
import { User } from "firebase/auth";

const Sidebar = ({ user, chatHistory, startNewChat }: { user: User | null; chatHistory: string[]; startNewChat?: () => void }) => {
  return (
    <div className="w-64 bg-white h-full shadow-lg flex flex-col">
      {/* 歷史對話區域 */}
      {user ? (
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 pt-2">歷史對話</h3>
          </div>
          
          <ul className="space-y-2">
            {chatHistory.length > 0 ? (
              chatHistory.map((title, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 bg-gray-100 p-2 rounded shadow hover:bg-gray-200"
                >
                  {title}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-600">尚無歷史對話</p>
            )}
          </ul>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-sm text-gray-600">請先登入以查看歷史對話紀錄</p>
        </div>
      )}

      {/* 新對話按鈕 - 固定在底部 */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={startNewChat}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          新對話
        </button>
      </div>

      {/* 帳號資訊區域 */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">帳號資訊</h3>
        {user ? (
          <div>
            <div className="flex items-center mb-2">
              <img
                className="inline-block size-10 rounded-full ring-2 ring-white mr-2"
                src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?..."}
                alt={user.displayName || "User"}
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{user.displayName || "使用者"}</p>
                <p className="text-xs text-gray-500">{user.email || "未提供"}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">尚未登入</p>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>(["對話 1", "對話 2", "對話 3"]); // 模擬歷史對話
  const [currentChat, setCurrentChat] = useState<string[]>([]);  // 當前對話（用來顯示在右邊的對話框）
  const router = useRouter();
  // 新對話按鈕處理邏輯
  const startNewChat = () => {
    setCurrentChat([]); // 清空歷史對話，這是可選的，根據需求來決定 
  };
  
  useEffect(() => {
    setIsClient(true);
    
    // 監聽 Firebase 認證狀態變化
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // 清理訂閱
    return () => unsubscribe();
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex h-screen pt-[72px] bg-gray-100">
      {/* 側邊欄 */}
      <Sidebar user={user} chatHistory={chatHistory} startNewChat={startNewChat}/>

      {/* 主內容 */}
      <div className="flex-1 h-full">
        <div className="flex flex-col h-full">
          <div className="text-center pt-11 pb-0">
            <h3 className="text-4xl font-bold mb-3">Welcome to My Website</h3>
            <p className="text-lg mb-3">資管系FAQ 請輸入提問</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}