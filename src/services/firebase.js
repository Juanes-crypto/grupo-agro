// src/services/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDUhW5jO7R21d2ndMyghxbXVBrw5_Ea1lc",
  authDomain: "agroapp-5cecb.firebaseapp.com",
  projectId: "agroapp-5cecb",
  storageBucket: "agroapp-5cecb.firebasestorage.app",
  messagingSenderId: "423703036242",
  appId: "1:423703036242:web:3100fa689309c14847ba8b",
  measurementId: "G-YVZFNZWGQT"
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth }; // ← Una sola línea elegante