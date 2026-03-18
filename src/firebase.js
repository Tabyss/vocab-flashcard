// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbH39BFXpBh3r55KWlrRm5PAHnjqbbPOY",
  authDomain: "flashcard-f3c7a.firebaseapp.com",
  projectId: "flashcard-f3c7a",
  storageBucket: "flashcard-f3c7a.firebasestorage.app",
  messagingSenderId: "604436386558",
  appId: "1:604436386558:web:945ebf0549615cbde4cbaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);