// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6w8fhvRCKG0EimnLAi3AtOFB5-QJmSp4",
  authDomain: "realtor-clone-react-57520.firebaseapp.com",
  projectId: "realtor-clone-react-57520",
  storageBucket: "realtor-clone-react-57520.appspot.com",
  messagingSenderId: "182555823693",
  appId: "1:182555823693:web:11db82d1473360579d5604"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();