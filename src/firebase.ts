import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCqgOaV-XKBKwehAda1kgHHx72L7d6a-x4",
    authDomain: "moviemates-992de.firebaseapp.com",
    databaseURL: "https://moviemates-992de.firebaseio.com",
    projectId: "moviemates-992de",
    storageBucket: "moviemates-992de.appspot.com",
    messagingSenderId: "1090853539078",
    appId: "1:1090853539078:web:d4d3b35191428f901ba287",
    measurementId: "G-EKN2B7TXN5"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
