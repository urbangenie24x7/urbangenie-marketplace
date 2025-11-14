import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAR757jp5A9sKg45vqZckfwTCLSLC-PRGk",
  authDomain: "freshcuts-5cb4c.firebaseapp.com",
  projectId: "freshcuts-5cb4c",
  storageBucket: "freshcuts-5cb4c.appspot.com",
  messagingSenderId: "14592809171",
  appId: "1:14592809171:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteFreshCutsUsersCollection() {
  try {
    const querySnapshot = await getDocs(collection(db, 'freshcuts_users'));
    
    if (querySnapshot.empty) {
      console.log('No freshcuts_users collection found or it is empty.');
      return;
    }

    for (const docSnapshot of querySnapshot.docs) {
      await deleteDoc(doc(db, 'freshcuts_users', docSnapshot.id));
      console.log(`Deleted document: ${docSnapshot.id}`);
    }
    
    console.log('All documents in freshcuts_users collection deleted successfully!');
  } catch (error) {
    console.error('Error deleting freshcuts_users collection:', error);
  }
}

deleteFreshCutsUsersCollection();