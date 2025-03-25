'use client';//切換至課戶端執行

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";//useRouter不能在自己的server執行，"use client"將資料丟到客戶端執行

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
      <div>
        <h1>Home</h1>
        <button onClick={handleClick}>Go to Profile</button>
        <Image
          src="/images/nextjs.png"
          alt="Next.js Logo"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}
