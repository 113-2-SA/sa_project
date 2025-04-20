'use client'
import CreatePost from "@/components/CreatePage";
import React, { useEffect, useState } from 'react';
import { db } from '@/_firebase/Config';
import { getDocs, collection } from 'firebase/firestore';
import { Button } from "@headlessui/react";

export default function Test() {
  const [posts, setPosts] = useState<{ title: string; content: string; tags: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = querySnapshot.docs.map((doc) => doc.data() as { title: string; content: string; tags: string[] });
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error getting documents: ', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <span className="loader"></span>
    </div>;
  }

  return (
    <div>
      <h2>已發布的貼文</h2>
      {posts.length === 0 ? (
        <p>目前沒有任何貼文。</p>
      ) : (


        posts.map((post, index) => (
          <div key={index} className="post border rounded-lg rounded-tr-lg border-gray-300 p-4 my-4 mx-6 shadow-md bg-white">
            <h1><strong>{post.title}</strong></h1>
            <p>{post.content}</p>
            <p>標籤：{post.tags.join(', ')}</p>
          </div>
        ))


      )}
      
    </div>
  );
}