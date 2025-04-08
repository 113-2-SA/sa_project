// Import the functions you need from the SDKs you need
import { getApps, initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkxuwkcTLJvc6Gy4cLmItaCK5I3bUeKDA",
  authDomain: "sa-project-e48f1.firebaseapp.com",
  databaseURL: "https://sa-project-e48f1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sa-project-e48f1",
  storageBucket: "sa-project-e48f1.firebasestorage.app",
  messagingSenderId: "303896804914",
  appId: "1:303896804914:web:01a31cb476b4712987862b",
  measurementId: "G-DQHBGZCCSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;

