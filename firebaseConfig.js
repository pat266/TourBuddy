// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


//require('dotenv').config();


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'api-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'project-id.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'project-id',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'project-id.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'sender-id',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'app-id',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-measurement-id',
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);



export {app}