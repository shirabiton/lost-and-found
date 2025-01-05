import { initializeApp } from 'firebase/app'; 
import { getDatabase, ref, set, get, onValue, push ,update } from 'firebase/database'; 

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, 
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID, 
};

// Initialize the Firebase app with the given configuration.
const app = initializeApp(firebaseConfig);

// Connect to the Firebase Realtime Database.
const database = getDatabase(app);

export { database, ref, set, get, onValue, push,update };
