import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const brandSettings = {
  logo: "", // Empty initially - admin will upload
  vertical: "freshcuts",
  brandName: "FreshCuts",
  tagline: "Fresh Meat, Delivered Daily",
  logoHeight: 40, // Default logo height in pixels
  landingCategoryCardsPerRow: 3, // Default category cards per row on landing page
  productsPerRow: 4 // Default products per row on product pages
};

async function seedBrandSettings() {
  try {
    await addDoc(collection(db, 'brandSettings'), {
      ...brandSettings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Brand settings seeded successfully!');
  } catch (error) {
    console.error('Error seeding brand settings:', error);
  }
}

seedBrandSettings();