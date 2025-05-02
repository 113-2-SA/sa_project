'use client'
import React, { useEffect, useState } from 'react';
import { db } from '@/_firebase/Config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import DeletePost from "@/components/deletePost";
import Commend from '@/components/commend';
import { Button } from '@/components/ui/button';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ChevronDownIcon } from '@heroicons/react/24/solid';

// 添加 Comment 類型定義
type Comment = {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: any;
};

// 修改 Post 類型定義，添加 comments
type Post = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  userId: string;
  createdAt: import('firebase/firestore').Timestamp;
  comments?: Comment[];
};

export default function Test() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<'title' | 'content' | 'newest'>('title'); // 新增排序狀態
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 新增排序方向狀態
  const [selectedTag, setSelectedTag] = useState<string>(''); // 新增標籤篩選狀態
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            // 獲取貼文數據
            const postData = { id: doc.id, ...doc.data() } as Post;
            
            // 獲取該貼文的所有回覆
            const commentsQuery = query(
              collection(db, 'posts', doc.id, 'comments'),
              orderBy('createdAt', 'desc')
            );
            const commentsSnapshot = await getDocs(commentsQuery);
            const comments = commentsSnapshot.docs.map(commentDoc => ({
              id: commentDoc.id,
              ...commentDoc.data()
            })) as Comment[];

            return { ...postData, comments };
          })
        );
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error getting documents: ', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getAllTags = (posts: Post[]) => {
    const tags = posts.flatMap(post => post.tags);
    return Array.from(new Set(tags));
  };

  // 篩選和排序貼文
  const filterAndSortPosts = (posts: Post[]) => {
    let filteredPosts = [...posts];
    
    // 先依據選擇的標籤進行篩選
    if (selectedTag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.includes(selectedTag)
      );
    }

    // 依據排序類型進行排序
    return filteredPosts.sort((a, b) => {
      if (sortType === 'newest') {
        return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime(); // / 依據創建時間排序 獲取a.createAt和b.createAt的時間差 越大越新越前面
          
      }
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      if (sortType === 'title') {
        return a.title.localeCompare(b.title) * compareValue;
      } else if (sortType === 'content') {
        return a.content.localeCompare(b.content) * compareValue;
      }
      return 0; // 如果沒有匹配的排序類型，則不進行排序
    });
  };

  // 處理排序變更
  const handleSort = (type: 'title' | 'content' | 'newest') => {
    if (type === sortType) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  };

  const toggleAccordion = (id: number) => {
    const content = document.getElementById(`content-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    if (content && icon) {
      const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';
      content.style.maxHeight = isExpanded ? '0px' : `${content.scrollHeight}px`;
      icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(45deg)';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <span className="loader"></span>
    </div>;
  }

  return (
    <>
    <div className='relative size-24' />
      <h2 className='text-2xl text-center font-bold my-4'>已發布的貼文</h2>
      <div className="flex justify-center gap-4 mb-4">
        {/* 標籤篩選下拉選單 */}
        <select 
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300"
        >
          <option value="">所有標籤</option>
          {getAllTags(posts).map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        {/* 最新發布排序按鈕 */}
        <button
          onClick={() => handleSort('newest')}
          className={`px-4 py-2 rounded ${
            sortType === 'newest' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          最新發布 {sortType === 'newest' }
        </button>

        <button
          onClick={() => handleSort('title')}
          className={`px-4 py-2 rounded ${
            sortType === 'title' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          按標題排序 {sortType === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('content')}
          className={`px-4 py-2 rounded ${
            sortType === 'content' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          按內容排序 {sortType === 'content' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>


      {/* 貼文列表 */}
      <div className='grid grid-cols-3 gap-2 px-6'>
        {posts.length === 0 ? (
          <p>目前沒有任何貼文。</p>
        ) : (
          filterAndSortPosts(posts).map((post) => (
            <div key={post.id} className="post border rounded-lg rounded-tr-lg border-gray-300 p-4 my-4 mx-6 shadow-md bg-white">
              <h1><strong>{post.title}</strong></h1>
              <p>{post.content}</p>
              <p>標籤：{post.tags.join(', ')}</p>
              <p>發布時間：{new Date(post.createdAt?.toDate()).toLocaleString()}</p>
              
              {/* 顯示回覆區塊 */}

<div className="mt-4 border-t pt-4">
              <Drawer>
                <DrawerTrigger className="flex items-center gap-1">
                  回覆總覽 ({post.comments?.length || 0})
                  <ChevronDownIcon aria-hidden="true" className="h-4 w-4 text-black-400" />
                </DrawerTrigger>
                <DrawerContent className='px-10 pb-10 mt:-3px'>
                  <DrawerHeader>
                  <div className=" mx-auto h-2 w-[100px] rounded-full bg-gray-100"></div>
                    <DrawerTitle className='text-center text-xl pt-2'>所有回覆</DrawerTitle>
                  </DrawerHeader>
                  
                    <h3 className="text-lg font-semibold mb-2">回覆 ({post.comments?.length || 0})</h3>
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
                  
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>


</div>
              {/* {post.id && post.userId && (
                <DeletePost postId={post.id} userId={post.userId} />
              )} */}
              <Commend postId={post.id} />
            </div>
          ))
        )}
      </div>
    </>
  );
}