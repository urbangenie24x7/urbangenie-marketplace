// Simple seeding script for emulators
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-urbangenie",
  storageBucket: "demo-urbangenie.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator
try {
  connectFirestoreEmulator(db, 'localhost', 8081);
  console.log('Connected to Firestore emulator');
} catch (error) {
  console.log('Emulator already connected or not available');
}

const categories = [
  {
    name: 'Beauty & Salon',
    description: 'Hair, skincare & beauty treatments',
    icon: 'Scissors',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
    is_active: true
  },
  {
    name: 'Home Services',
    description: 'Cleaning, repairs & maintenance',
    icon: 'Home',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    is_active: true
  },
  {
    name: 'Wellness Services',
    description: 'Health, fitness & wellness',
    icon: 'Activity',
    gradient: 'bg-gradient-to-br from-green-500 to-teal-500',
    is_active: true
  },
  {
    name: 'Food & Beverages',
    description: 'Fresh food & drink delivery',
    icon: 'Coffee',
    gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
    is_active: true
  },
  {
    name: 'Electronics & Gadgets',
    description: 'Repair, installation & tech support',
    icon: 'Zap',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    is_active: true
  }
];

const services = [
  {
    title: 'Hair Cut & Styling',
    category: 'Beauty & Salon',
    subcategory: 'Hair Services',
    description: 'Professional haircut with styling',
    price: 499,
    duration: '45 mins',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    rating: 4.8,
    total_reviews: 256,
    service_type: 'platform',
    is_active: true
  },
  {
    title: 'House Cleaning',
    category: 'Home Services',
    subcategory: 'Cleaning',
    description: 'Deep cleaning service for homes',
    price: 899,
    duration: '3 hours',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    rating: 4.5,
    total_reviews: 234,
    service_type: 'platform',
    is_active: true
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting to seed data...');
    
    // Seed categories
    console.log('Adding categories...');
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), {
        ...category,
        created_at: serverTimestamp()
      });
      console.log(`✓ Added category: ${category.name}`);
    }
    
    // Seed services
    console.log('Adding services...');
    for (const service of services) {
      await addDoc(collection(db, 'services'), {
        ...service,
        created_at: serverTimestamp()
      });
      console.log(`✓ Added service: ${service.title}`);
    }
    
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();