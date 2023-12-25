import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnexWmMGAX9fG3lad4XIDzqhpUH8MxCoM",
  authDomain: "reactnative-event.firebaseapp.com",
  projectId: "reactnative-event",
  storageBucket: "reactnative-event.appspot.com",
  messagingSenderId: "889893022804",
  appId: "1:889893022804:web:f38357ddd6d4611df211c1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => {
  signInWithCredential(auth, provider).then((result) => {
    console.log(result);
  });
};

