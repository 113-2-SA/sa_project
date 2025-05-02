import React, { useState } from 'react';
import { db, auth } from '@/_firebase/Config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CommendProps {
  postId: string;  // 新增 props 接收貼文 ID
}

const Commend: React.FC<CommendProps> = ({ postId }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReplyClick = () => {
        // 檢查用戶是否登入
        if (!auth.currentUser) {
            alert('請先登入後再回覆');
            return;
        }
        setIsReplying(true);
    };

    const handleSendClick = async () => {
        if (!reply.trim()) return;
        
        try {
            setLoading(true);
            
            // 將回覆存入資料庫
            await addDoc(collection(db, 'posts', postId, 'comments'), {
                content: reply.trim(),
                userId: auth.currentUser?.uid,
                userName: auth.currentUser?.displayName || '匿名用戶',
                createdAt: serverTimestamp(),
            });

            // 清空回覆框並關閉
            setReply('');
            setIsReplying(false);
            alert('回覆已送出');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('回覆發送失敗');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <button 
                onClick={handleReplyClick}
                className="text-blue-500 hover:text-blue-700"
            >
                撰寫回覆
            </button>
            
            {isReplying && (
                <div className="mt-2 space-y-2">
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="請輸入回覆內容..."
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                        <button 
                            onClick={() => setIsReplying(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSendClick}
                            disabled={loading || !reply.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            {loading ? '送出中...' : '送出回覆'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Commend;