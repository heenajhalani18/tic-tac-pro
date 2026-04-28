import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBk8LFVaS8Ej63eP2pRhgd0dGFoaIX1iw",
  authDomain: "tic-tac-pro-1aa63.firebaseapp.com",
  projectId: "tic-tac-pro-1aa63",
  storageBucket: "tic-tac-pro-1aa63.firebasestorage.app",
  messagingSenderId: "331590627215",
  appId: "1:331590627215:web:f870f2754f8901590665fa"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);