'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, getFirestore } from "firebase/firestore"; 

import app from "@/_firebase/Config"
// import app from "/src/_firebase/Config"
const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, "users"));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password });
    router.push('/profile'); // Redirect to profile page after successful login
  };


  // function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">登入</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm flex justify-center font-medium text-gray-700">
              使用者名稱
            </label>
            <div className="flex justify-center">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            登入
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          還沒有帳號嗎？{' '}
          <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            註冊
          </a>
        </p>
      </div>
    </div>
  );
};
export default Login;
