'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from '../components/Chat';
import { auth } from "../_firebase/Config";
import { User } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/_firebase/Config';
import { Trash2, Pencil } from 'lucide-react';

const Sidebar = ({ user, chatHistory, onChatClick, onDeleteChat }: { 
  user: User | null; 
  chatHistory: {id: string, topic: string}[]; 
  onChatClick: (chatId: string) => void;
  onDeleteChat: () => void;
}) => {
  // 處理刪除對話
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('確定要刪除這個對話嗎？')) {
      try {
        await deleteDoc(doc(db, 'chats', chatId));
        onDeleteChat();
        onChatClick('');
      } catch (error) {
        console.error('Error deleting chat:', error);
        alert('刪除對話失敗');
      }
    }
  };

  // 處理編輯對話主題
  const handleEditTopic = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newTopic = prompt('請輸入新的對話主題：');
    if (newTopic) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          topic: newTopic
        });
        onDeleteChat(); // 使用相同的函數來刷新列表
      } catch (error) {
        console.error('Error updating chat topic:', error);
        alert('更新對話主題失敗');
      }
    }
  };

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
              chatHistory.map((chat) => (
                <li
                  key={chat.id}
                  className="text-sm text-gray-700 bg-gray-100 p-2 rounded shadow hover:bg-gray-200 cursor-pointer flex justify-between items-center group"
                  onClick={() => onChatClick(chat.id)}
                >
                  <span className="flex-1 truncate">{chat.topic}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => handleEditTopic(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded"
                      title="Edit topic"
                    >
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                      title="Delete chat"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
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
          onClick={() => onChatClick('')}
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
  const [chatHistory, setChatHistory] = useState<{id: string, topic: string}[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isUpdatingFromSidebar, setIsUpdatingFromSidebar] = useState(false);
  const router = useRouter();

  // 獲取用戶對話歷史
  const fetchUserChats = async (shouldResetChatId: boolean = false) => {
    if (user) {
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('userEmail', '==', user.email),where('sort', '==', 'imfaq'));
        const querySnapshot = await getDocs(q);
        
        const chats = querySnapshot.docs.map(doc => ({
          id: doc.id,
          topic: doc.data().topic || '',
          lastMessageTime: doc.data().lastMessageTime || ''
        }));
        
        // 按照 lastMessageTime 降序排序
        chats.sort((a, b) => {
          if (!a.lastMessageTime || !b.lastMessageTime) return 0;
          return b.lastMessageTime.localeCompare(a.lastMessageTime);
        });
        
        // 移除 lastMessageTime，只保留需要的欄位
        const sortedChats = chats.map(({ id, topic }) => ({ id, topic }));
        setChatHistory(sortedChats);

        // 只有在需要時才重置對話 ID
        if (shouldResetChatId) {
          setSelectedChatId(null);
        }
      } catch (error) {
        console.error('Error fetching user chats:', error);
      }
    }
  };

  // 當用戶狀態改變時獲取對話歷史
  useEffect(() => {
    fetchUserChats(true);
  }, [user]);

  // 處理新對話產生
  const handleNewChat = (chatId: string) => {
    setIsUpdatingFromSidebar(true);
    setSelectedChatId(chatId); // 先設置新的對話 ID
    fetchUserChats(false); // 更新對話歷史，但不重置對話 ID
    setIsUpdatingFromSidebar(false);
  };

  // 處理對話點擊
  const handleChatClick = (chatId: string) => {
    setIsUpdatingFromSidebar(true);
    if (!chatId) {
      // 如果是點擊新對話按鈕
      setSelectedChatId(null);
      fetchUserChats(true); // 重置對話 ID
    } else {
      setSelectedChatId(chatId);
      fetchUserChats(false); // 更新對話歷史，但不重置對話 ID
    }
    setIsUpdatingFromSidebar(false);
  };

  // 處理清空對話
  const handleClearChat = () => {
    setSelectedChatId(null);
  };

  // 處理對話更新
  const handleChatUpdate = () => {
    // 只有在不是從側邊欄更新時才保持當前對話 ID
    fetchUserChats(isUpdatingFromSidebar);
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

  // 處理刪除對話
  const handleDeleteChat = () => {
    setIsUpdatingFromSidebar(true);
    fetchUserChats(true); // 刪除後需要重置對話 ID
    setIsUpdatingFromSidebar(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex h-screen pt-[72px] bg-gray-100">
      {/* 側邊欄 */}
      <Sidebar 
        user={user} 
        chatHistory={chatHistory} 
        onChatClick={handleChatClick}
        onDeleteChat={handleDeleteChat}
      />

      {/* 主內容 */}
      <div className="flex-1 h-full">
        <div className="flex flex-col h-full">
          <div className="text-center pt-11 pb-0">
            <h3 className="text-4xl font-bold mb-3">Welcome to My Website</h3>
            <p className="text-lg mb-3">資管系FAQ 請輸入提問</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat 
              selectedChatId={selectedChatId} 
              onNewChat={handleNewChat} 
              onClearChat={handleClearChat}
              onChatUpdate={handleChatUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}