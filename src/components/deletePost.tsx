import React from 'react';
import { db, auth } from '@/_firebase/Config';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";

interface DeletePostProps {
  postId: string;
  userId: string;
}

const DeletePost: React.FC<DeletePostProps> = ({ postId, userId }) => {
  const handleDelete = async () => {
    try {
      // Validate inputs
      if (!postId || !userId) {
        console.error('Missing postId or userId');
        return;
      }

      // 確保使用者已登入
      if (!auth.currentUser) {
        alert('請先登入以執行此操作');
        return;
      }

      // 確認是否為貼文作者
      if (auth.currentUser.uid !== userId) {
        alert('您無權刪除此貼文');
        return;
      }

      // 刪除文檔
      const postDocRef = doc(db, 'posts', postId);
      await deleteDoc(postDocRef);
      window.location.reload(); // Refresh the page after deletion
      alert('貼文已刪除');
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('刪除失敗');
    }
  };

  // 只有當前登入用戶是貼文作者時才顯示刪除按鈕
  return auth.currentUser?.uid === userId ? (
    <Button variant='outline' className='hover:bg-rose-100 ' 
      onClick={handleDelete}
      >
      刪除貼文
    </Button>
  ) : null;
};

export default DeletePost;
