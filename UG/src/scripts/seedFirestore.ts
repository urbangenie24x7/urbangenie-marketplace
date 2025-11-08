import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Categories data
const categories = [
  {
    name: 'Beauty & Salon',
    description: 'Hair, skincare & beauty treatments',
    icon: 'Scissors',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
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
    name: 'Home Services',
    description: 'Cleaning, repairs & maintenance',
    icon: 'Home',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
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

// Services data
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
    title: 'Facial Treatment',
    category: 'Beauty & Salon',
    subcategory: 'Skincare',
    description: 'Deep cleansing facial treatment',
    price: 899,
    duration: '60 mins',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    rating: 4.9,
    total_reviews: 142,
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
  },
  {
    title: 'Yoga Session',
    category: 'Wellness Services',
    subcategory: 'Fitness',
    description: 'Personal yoga training session',
    price: 799,
    duration: '60 mins',
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400&h=300&fit=crop',
    rating: 4.8,
    total_reviews: 156,
    service_type: 'platform',
    is_active: true
  }
];

export const seedFirestore = async () => {
  try {
    console.log('Starting Firestore seeding...');

    // Seed categories
    const categoryIds: { [key: string]: string } = {};
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        created_at: serverTimestamp()
      });
      categoryIds[category.name] = docRef.id;
      console.log(`Added category: ${category.name}`);
    }

    // Seed services
    for (const service of services) {
      const categoryId = categoryIds[service.category];
      if (categoryId) {
        await addDoc(collection(db, 'services'), {
          ...service,
          category_id: categoryId,
          created_at: serverTimestamp()
        });
        console.log(`Added service: ${service.title}`);
      }
    }

    console.log('Firestore seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firestore:', error);
  }
};