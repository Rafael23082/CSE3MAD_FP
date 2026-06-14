import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDipQOWsouhl5bJPBN71d21ozvy_yh2x7s",
  authDomain: "se3mad-fp-2e58f.firebaseapp.com",
  projectId: "cse3mad-fp-2e58f",
  storageBucket: "se3mad-fp-2e58f.firebasestorage.app",
  messagingSenderId: 435684681786,
  appId: "1:435684681786:web:fad73df6a456484226ed03",
  measurementId: "G-SJGVHEZBQ0",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
