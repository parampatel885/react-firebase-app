
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAkg7PqC_aZflY4HARUtyeYAdcF80i_Z1U",
  authDomain: "playpal-9b5e9.firebaseapp.com",
  projectId: "playpal-9b5e9",
  storageBucket: "playpal-9b5e9.firebasestorage.app",
  messagingSenderId: "264476327908",
  appId: "1:264476327908:web:fad430da18f593467a91f1",
  measurementId: "G-H8LGD1VE4G"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
