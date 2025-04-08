// src/components/Register.tsx
import React, { useState } from 'react';
import auth from '@/_firebase/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccessMessage(`帳號已創建成功，歡迎 ${user.email}`);
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
    <div>
      <h2>註冊帳號</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>電子郵件</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密碼</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '註冊中...' : '註冊'}
        </button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default Register;
