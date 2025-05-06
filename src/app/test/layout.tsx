'use client';

import CreatePost from '@/components/CreatePage';
import React from 'react';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
            <div className="test-layout" style={{ position: 'relative', backgroundColor: '#f3f4f6' }}>
        {children}
            <div style={{ position: 'fixed', bottom: 30, right: 30}}>
              <CreatePost />
            </div>
            </div>
  );
}