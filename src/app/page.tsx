'use client';//切換至課戶端執行

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
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
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to My Website</h1>
          <p className="text-lg mb-8">This is a simple example of a Next.js page.</p>
          <Chat />
        </div>
      </div>
    </div>
  );
}
