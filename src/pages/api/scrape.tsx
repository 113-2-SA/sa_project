import { scrapeFJUCourseInfo } from '@/lib/scrapeFju';
import { db } from '@/_firebase/Config';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; count: number; }): void; new(): any; }; }; }) {
  const data = await scrapeFJUCourseInfo();

  for (const text of data) {
    await addDoc(collection(db, 'fju_courses'), {
      content: text,
      source: 'FJU IM 網頁',
      createdAt: new Date(),
    });
  }

  res.status(200).json({ message: '資料已寫入', count: data.length });
}
