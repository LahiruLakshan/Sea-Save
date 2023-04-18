// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBnbt_AVsY4wxoXrmnSAVjuNQa8sgnJzwE",
    authDomain: "sea-save.firebaseapp.com",
    projectId: "sea-save",
    storageBucket: "sea-save.appspot.com",
    messagingSenderId: "190409896380",
    appId: "1:190409896380:web:1cbf4393aad8a6efe0fbb9",
    measurementId: "G-R63L13036P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
