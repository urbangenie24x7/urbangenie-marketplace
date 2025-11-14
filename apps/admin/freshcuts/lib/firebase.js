import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk",
  authDomain: "freshcuts-5cb4c.firebaseapp.com",
  projectId: "freshcuts-5cb4c",
  storageBucket: "freshcuts-5cb4c.appspot.com",
  messagingSenderId: "14592809171",
  appId: "1:14592809171:web:abc123def456"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)