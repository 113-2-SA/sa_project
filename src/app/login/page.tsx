'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 新增引入 Link 元件
import { collection, getDocs, getFirestore } from "firebase/firestore"; 
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth , app } from '@/_firebase/Config';
import { Button } from "@/components/ui/button"

// import app from "/src/_firebase/Config"
const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, "users"));

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');


  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });

  //帳號登入
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully:', userCredential.user);
      router.push('/profile'); // Redirect to profile page after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      alert('帳號或密碼錯誤，請重新輸入');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("登入成功！", user.displayName, user.email);
      // 可跳轉頁面或儲存 user.uid 當 chatId
    } catch (error) {
      console.error("Google 登入失敗：", error);
    }
  };
 
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();//指定變數router為useRouter()
  useEffect(() => {
    setIsClient(true); // 當組件已經載入到客戶端後，設置為 true
  }, []);

  const Clicksign = () => {
    console.log("Button clicked");
    router.push("/signup");//觸發handleClick時，導向/signup
  }





  // function Login() {
  return (


    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">登入</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm flex justify-center font-medium text-gray-700">
              電子郵件信箱
            </label>
            <div className="flex justify-center">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm flex justify-center font-medium text-gray-700">
              密碼
            </label>
            <div className="flex justify-center">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mx-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
          >
            登入
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          沒有帳號?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            <Button variant="outline" onClick={Clicksign}>Sign up</Button>
          </Link>
        </p>
        <p className="mt-4 text-md text-center text-gray-600">
          <b>其他登入方式</b><br />
           
              <button
                onClick={handleGoogleLogin}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 button"
              >
                使用 Google 登入
              </button>
        </p>
      </div>
    </div>
  );
};
export default Login;
