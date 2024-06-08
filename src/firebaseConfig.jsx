import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMSsQycvMh3hf53mbfnMR6wHKwN3vQ4QQ",
  authDomain: "senbet-7f594.firebaseapp.com",
  projectId: "senbet-7f594",
  storageBucket: "senbet-7f594.appspot.com",
  messagingSenderId: "105789742828",
  appId: "1:105789742828:web:0a095a832caf59e9fe4fc9",
  measurementId: "G-JMWFXYHZEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);