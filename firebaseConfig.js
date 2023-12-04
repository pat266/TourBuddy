// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'api-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'project-id.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'project-id',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'project-id.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'sender-id',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'app-id',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-measurement-id',
  databaseURL: "https://tourbuddy-402307-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const database = getDatabase(app);

export { app, auth, database };
