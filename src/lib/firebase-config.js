// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB0Cfv_yiToI3XJyNtoi0crTUWT6k3nL4",
  authDomain: "semantic-editor-2b4a1.firebaseapp.com",
  projectId: "semantic-editor-2b4a1",
  storageBucket: "semantic-editor-2b4a1.appspot.com",
  messagingSenderId: "847881381023",
  appId: "1:847881381023:web:0f2958090cc2557437eeaa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database
export const db = getFirestore(app);
