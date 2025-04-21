'use client';//切換至課戶端執行

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";//useRouter不能在自己的server執行，"use client"將資料丟到客戶端執行
import Chat from '../components/Chat';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();//指定變數router為useRouter()

  useEffect(() => {
    setIsClient(true); // 當組件已經載入到客戶端後，設置為 true
  }, []);

  const handleClick = () => {
    console.log("Button clicked");
    router.push("/test");//觸發handleClick時，導向/test
  }

  if (!isClient) {
    return null; // 當未載入至客戶端時不渲染內容
  }

  return (
    <div>
      
      <div className="flex justify-center items-center h-screen bg-gray-100" style={{ marginTop: '-50px', minHeight: '100vh' }}>
        <div className="text-center">
        <h3 className="text-4xl font-bold mb-2" style={{ height: '5vh', lineHeight: '1.5' }}>Welcome to My Website</h3><br/>
        <p className="text-lg mb-4" style={{  lineHeight: '1.4' }}>This is a simple example of a Next.js page.<br />資管系FAQ 請輸入提問</p>
          <Chat />
        </div>
      </div>
    </div>
  );
}
