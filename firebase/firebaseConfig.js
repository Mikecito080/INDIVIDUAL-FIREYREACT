import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCISnZ-0iRxxH3M6AzpaNmyvAhykZtQvU",
  authDomain: "gotireact.firebaseapp.com",
  projectId: "gotireact",
  storageBucket: "gotireact.firebasestorage.app",
  messagingSenderId: "478324477986",
  appId: "1:478324477986:web:563664766e91fc0addfa7b"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
