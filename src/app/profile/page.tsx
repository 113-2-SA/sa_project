'use client';

import { auth } from '@/_firebase/Config';
import { db } from '@/_firebase/Config';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DeletePost from '@/components/deletePost';
import Commend from '@/components/commend';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  userId: string;
  comments?: {
    id: string;
    content: string;
    userName: string;
    createdAt: any;
  }[];
}

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 監聽用戶登入狀態
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 獲取用戶的貼文
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      try {
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(postsQuery);
        const userPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);


  // Google 登入
    const provider = new GoogleAuthProvider();
    // const provider = new GoogleAuthProvider(); // 如果使用 Firebase v9+
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

  if (!user) {
    // 未登入時顯示提示
    return (
      <div className="flex justify-center items-center h-dvh bg-gray-100">
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-2">Welcome to My Website</h3>
          <p className="text-lg mb-4">你尚未登入，無法查看你的貼文哦!</p>
          <button
                onClick={handleGoogleLogin}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 button"
              >
                使用 Google 登入
              </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 顯示用戶頭像和名字 */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          className="w-16 h-16 rounded-full ring-2 ring-white hover:brightness-110 transition"
          src={
            user.photoURL ??
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...'
          }
          alt="User Avatar"
        />
        <p className="text-3xl font-bold">{user.displayName ?? '使用者'}</p>
      </div>

      {/* 顯示用戶的貼文 */}
      <h2 className="text-2xl font-semibold mb-4">我的貼文</h2>
      {loading ? (
        <p>載入中...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">您尚未發布任何貼文。</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="post border rounded-lg border-gray-300 p-4 my-4 shadow-md bg-white"
          >
            <h1 className="text-xl font-bold">{post.title}</h1>
            <p>{post.content}</p>
            <p>標籤：{post.tags.join(', ')}</p>

            {/* 顯示回覆區塊 */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">
                回覆 ({post.comments?.length || 0})
              </h3>
              <div className="space-y-2">
                {post.comments?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt?.toDate()).toLocaleString()}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 刪除貼文和新增回覆 */}
            <DeletePost postId={post.id} userId={post.userId} />
            <Commend postId={post.id} />
          </div>
        ))
      )}
    </div>
  );
}