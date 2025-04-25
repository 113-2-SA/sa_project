'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/_firebase/Config';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface DeletePostProps {
  postId: string;
  userId: string;
}

const DeletePost: React.FC<DeletePostProps> = ({ postId, userId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
      
      router.refresh();
      <Alert>
        <AlertTitle>刪除成功</AlertTitle>
        <AlertDescription>貼文已成功刪除。</AlertDescription>
      </Alert>;
      alert('刪除成功');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('刪除失敗');
    }
  };



  return auth.currentUser?.uid === userId ? (
    // <Button 
    //   variant='outline' 
    //   className='hover:bg-rose-100'
    //   onClick={handleDelete}
    // >
    //   刪除貼文
    // </Button>

<AlertDialog>
<AlertDialogTrigger asChild>
  <Button variant="outline" className='hover:bg-rose-300'>刪除貼文</Button>
</AlertDialogTrigger>
<AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>確定要刪除貼文?</AlertDialogTitle>
      <AlertDialogDescription>
      按下確認後將永久刪除貼文，無法復原。
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className='hover:bg-lime-100'>取消</AlertDialogCancel>
      <AlertDialogAction 
      className='border-color-black hover:bg-rose-300'
      onClick={handleDelete}>刪除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
 
 
  ) : null;
};

export default DeletePost;
