// /pages/api/posts.ts
import { collection, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../_firebase/Config'; // 🔥 這邊引用你已經初始化好的 db

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);

    const postsData = await Promise.all(
      postsSnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();

        const commentsRef = collection(db, 'posts', postDoc.id, 'comments');
        const commentsSnapshot = await getDocs(commentsRef);
        const comments = commentsSnapshot.docs.map(commentDoc => {
          const commentData = commentDoc.data();
          return {
            id: commentDoc.id,
            content: commentData.content || '',
            createdAt: commentData.createdAt?.toDate?.().toISOString() || '',
          };
        });

        return {
          id: postDoc.id,
          title: postData.title || '',
          content: postData.content || '',
          createdAt: postData.createdAt?.toDate?.().toISOString() || '',
          tags: postData.tags || [],
          resource: postData.resource || [],
          comments: comments.map(c => ({
            content: c.content || '',
            createdAt: c.createdAt?.toDate?.().toISOString() || '',
          })),
        };
      })
    );

    res.status(200).json({ data: postsData });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}
