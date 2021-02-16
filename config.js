import {firebase} from 'firebase/app';
import "@firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyDb5YeBCNBWZdbujwIjo-w1rY86FV8Lujg",
    authDomain: "wily-70515.firebaseapp.com",
    projectId: "wily-70515",
    storageBucket: "wily-70515.appspot.com",
    messagingSenderId: "15359308912",
    appId: "1:15359308912:web:dfcaa738bd6ed049f8b0b5"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  export default db;