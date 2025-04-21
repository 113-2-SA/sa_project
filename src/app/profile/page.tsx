'use client'

import {auth} from '@/_firebase/Config';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export default function Profile() {
    

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        return setUser(currentUser);
      });

      return () => unsubscribe();
    }, []);

    return (
        <div>
            {user ? (
                <div className="flex justify-center items-center bg-gray-100" style={{ height: '5vh' }}>
                <div className="text-center">
                <h3 className="text-4xl font-bold mb-2" style={{ height: '3vh', lineHeight: '1.5' }}>Welcome to My Website</h3><br/>
                <p className="text-lg mb-4" style={{  lineHeight: '1.4' }}>This is a simple example of a Next.js page.<br />資管系FAQ 請輸入提問</p>
                </div>
              </div>
            ) : (

              <div className="flex justify-center items-center h-screen bg-gray-100">
              <div className="text-center">
              <h3 className="text-4xl font-bold mb-2" style={{ height: '3vh', lineHeight: '1.5' }}>Welcome to My Website</h3><br/>
              <p className="text-lg mb-4" style={{  lineHeight: '1.4' }}> No user is signed in.</p><a href="/login" className="text-blue-500 hover:underline">Login</a></div>
            </div>
                
            )}
        </div>
    );
}