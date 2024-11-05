// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6iVyoHYeISNe4L7gNs3vqIFL3AcepeNI",
  authDomain: "project1-c8eb9.firebaseapp.com",
  projectId: "project1-c8eb9",
  storageBucket: "project1-c8eb9.appspot.com",
  messagingSenderId: "579855668130",
  appId: "1:579855668130:web:2a30286d6bf9019adfd8fb",
  measurementId: "G-MWRGERNEMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// init firestore service
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
