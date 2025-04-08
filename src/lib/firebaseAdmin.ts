// lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import firebase from 'firebase/compat/app';

const serviceAccount = require('/firebaseServiceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app(); // 如果已經初始化過，則使用當前的應用
}
