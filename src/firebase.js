// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
    apiKey: "AIzaSyAwbdBuGHGZgjFLf481KlarhngdukIFzm8",
    authDomain: "reware-07.firebaseapp.com",
    databaseURL: "https://reware-07-default-rtdb.firebaseio.com",
    projectId: "reware-07",
    storageBucket: "reware-07.firebasestorage.app",
    messagingSenderId: "834166696182",
    appId: "1:834166696182:web:83d13145e8634ed4eca4d7",
    measurementId: "G-P9R88WEB28"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

// Export db, auth, and app
export { db, auth, app };