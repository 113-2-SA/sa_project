// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from '../lib/firebaseAdmin';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      // 使用 Firebase 客戶端 SDK 進行 Google 登入
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);

      // 獲取 Google ID token
      const user = result.user;
      const idToken = await user?.getIdToken();

      if (idToken) {
        // 發送 ID token 到 API 路由進行伺服器端驗證
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (data.message === '登入成功') {
          // 登入成功，將使用者導向首頁
          router.push('/');
        } else {
          setErrorMessage(data.message);
        }
      }
    } catch (error) {
      setErrorMessage('登入失敗');
    }
  };

  return (
    <div>
      <h2>登入</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={handleGoogleLogin}>使用 Google 登入</button>
    </div>
  );
};

export default Login;
