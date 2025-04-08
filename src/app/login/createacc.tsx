import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [account, setAccount] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 註冊用戶
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const auth = getAuth();

    try {
      const res = await createUserWithEmailAndPassword(auth, account.email, account.password);
      setMessage("帳號已產生！");
      console.log({ res });
    } catch (error: any) {
      let message = "";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "電子信箱已註冊";
          break;
        case "auth/weak-password":
          message = "密碼強度不足";
          break;
        case "auth/invalid-email":
          message = "電子郵件格式錯誤";
          break;
        default:
          message = "系統錯誤:" + error.code;
      }
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // 更新表單欄位
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <h2>註冊帳號</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">電子郵件</label>
          <input
            type="email"
            id="email"
            name="email"
            value={account.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            name="password"
            value={account.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '註冊中...' : '註冊'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
