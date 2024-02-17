// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-76f1b.firebaseapp.com",
  projectId: "mern-blog-76f1b",
  storageBucket: "mern-blog-76f1b.appspot.com",
  messagingSenderId: "724936512477",
  appId: "1:724936512477:web:8eb7818e97b39106045c34",
  measurementId: "G-61WQ2MG4D8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);