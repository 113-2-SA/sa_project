import { getAuth } from 'firebase-admin/auth';
import { NextApiRequest } from 'next';
import { IncomingMessage } from 'http';

export async function getUserFromSession(req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> }) {
  try {
    const token = req.cookies.token; // 假設用戶的 Firebase ID Token 存儲在 cookies 中
    if (!token) {
      throw new Error('未找到用戶會話');
    }

    // 驗證 Firebase ID Token 並獲取用戶信息
    const decodedToken = await getAuth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    };
  } catch (error) {
    console.error('Error verifying user session:', error);
    return null;
  }
}