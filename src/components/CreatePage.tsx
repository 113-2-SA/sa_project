// pages/createPost.js
// Removed duplicate import of useState
'use client'
import { db } from '../_firebase/Config';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../_firebase/Config'; 
import { useState } from 'react';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';


export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [open, setOpen] = useState(false); // 將初始值改為 false

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // 檢查用戶是否登入
    if (!auth.currentUser) {
      alert('請先登入後再發布文章')
      
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        tags: tags.split(','),
        userId: auth.currentUser.uid,  // 因為已經確認登入，可以直接使用 uid
        createdAt: new Date(),
      });
      
      // 發布成功後清空表單
      setTitle('');
      setContent('');
      setTags('');
      alert('貼文發佈成功');
      setOpen(false); // 關閉 Dialog
    } catch (error) {
      alert('發佈失敗');
    }
  };

  return (
    <>
      {/* {auth.currentUser && ( */}
      <Button 
        type="button" 
        onClick={() => setOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        建立新貼文
      </Button>
      {/* )} */}

      <Dialog 
      open={open} 
      onClose={() => setOpen(false)} 
      className="relative z-10"
      >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
            <PencilSquareIcon className="h-6 w-6 text-gray-500" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
              創建貼文
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <input className='outline-sky-500'
              type="text"
              placeholder="標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              />
              <textarea className='mt-2 border-2 border-solid rounded-lg  border-gray-500 outline-sky-500'
              placeholder="內容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              />


              <div className='flex-col gap-2 my-2'>
              <label className='text-sm font-semibold text-sky-600 ml-0'>
                <input className='text-left '
                type="radio"
                name="tags"
                value="#課業"
                checked={tags === "#課業"}
                onChange={(e) => setTags(e.target.value)}
                />
                #課業
              </label>
              <label className='flex items-center text-sm font-semibold text-sky-600'>
                <input
                type="radio"
                name="tags"
                value="#課程分享"
                checked={tags === "#課程分享"}
                onChange={(e) => setTags(e.target.value)}
                className="mr-2"
                />
                #課程分享
              </label>
              <label className='flex items-center text-sm font-semibold text-sky-600'>
                <input
                type="radio"
                name="tags"
                value="#其他"
                checked={tags === "#其他"}
                onChange={(e) => setTags(e.target.value)}
                className="mr-2"
                />
                #其他
              </label>
              </div>

              <button
              type="button"
              data-autofocus
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
              取消發佈
              </button>
              <button
              type="submit"
              data-autofocus
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
              發佈
              </button>
            </form>
            </div>
          </div>
          </div>
        </DialogPanel>
        </div>
      </div>
      </Dialog>
    </>
  );
}




