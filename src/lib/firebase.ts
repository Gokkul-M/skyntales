import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

const missingVars = requiredEnvVars.filter(
  (key) => !import.meta.env[key]
);

if (missingVars.length > 0) {
  console.error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
}

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
