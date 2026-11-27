// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDy8kLjebEr4gup3vQ3n8AuwOsguTVwKpg",
  authDomain: "cinemageek-68053.firebaseapp.com",
  projectId: "cinemageek-68053",
  storageBucket: "cinemageek-68053.firebasestorage.app",
  messagingSenderId: "1009929881975",
  appId: "1:1009929881975:web:e92a95e086e58202e5f972",
  measurementId: "G-R7ELQY7BZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);