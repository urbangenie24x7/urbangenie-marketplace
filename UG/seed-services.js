// Simple script to seed services - run with: node seed-services.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "urbangenie-demo.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "urbangenie-demo",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "urbangenie-demo.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleServices = [
  {
    title: 'Hair Cut & Styling',
    category: 'Beauty & Salon',
    subcategory: 'Hair Services',
    description: 'Professional haircut with styling by experienced stylists',
    price: 499,
    duration: '45 mins',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 0,
    rating: 4.8,
    total_reviews: 256
  },
  {
    title: 'Facial Treatment',
    category: 'Beauty & Salon',
    subcategory: 'Skincare',
    description: 'Deep cleansing facial with premium products',
    price: 899,
    duration: '60 mins',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 15,
    discounted_price: 764,
    rating: 4.9,
    total_reviews: 142
  },
  {
    title: 'House Deep Cleaning',
    category: 'Home Services',
    subcategory: 'Cleaning',
    description: 'Complete deep cleaning service for your home',
    price: 1299,
    duration: '4 hours',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 20,
    discounted_price: 1039,
    rating: 4.6,
    total_reviews: 234
  },
  {
    title: 'Personal Yoga Session',
    category: 'Wellness Services',
    subcategory: 'Yoga',
    description: 'One-on-one yoga training with certified instructor',
    price: 899,
    duration: '60 mins',
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 0,
    rating: 4.8,
    total_reviews: 156
  },
  {
    title: 'Mobile Phone Repair',
    category: 'Electronics & Gadgets',
    subcategory: 'Repair',
    description: 'Professional mobile phone repair service',
    price: 899,
    duration: '2-3 hours',
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 0,
    rating: 4.5,
    total_reviews: 145
  }
];

async function seedServices() {
  try {
    console.log('🌱 Starting to seed services...');
    
    for (const service of sampleServices) {
      await addDoc(collection(db, 'services'), {
        ...service,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      console.log(`✓ Added: ${service.title}`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleServices.length} services!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();