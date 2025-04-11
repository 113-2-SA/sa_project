'use client'; // 切換至客戶端執行

import React, { useState } from 'react';
import { auth } from '@/_firebase/Config'; // 確保這裡的路徑正確
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const Signup = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表單的預設提交行為
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccessMessage(`帳號已創建成功，歡迎 ${user.email}`);
      console.log("註冊成功", user);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('此電子郵件已被註冊');
          break;
        case 'auth/weak-password':
          setErrorMessage('密碼強度不足');
          break;
        case 'auth/invalid-email':
          setErrorMessage('電子郵件格式錯誤');
          break;
        default:
          setErrorMessage('註冊過程中發生錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">註冊帳號</h2>
        <form onSubmit={Signup} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-center">
              電子郵件
            </label>
            <div className="flex justify-center">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-center">
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
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? '註冊中...' : '註冊'}
          </button>
        </form>
        {errorMessage && <p className="mt-4 text-sm text-center text-red-600">{errorMessage}</p>}
        {successMessage && <p className="mt-4 text-sm text-center text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Register;