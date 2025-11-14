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

const bannerAds = [
  {
    text: "Fresh Deals Daily!",
    icon: "<path d='M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z'/>",
    order: 1,
    active: true,
    vertical: "freshcuts"
  },
  {
    text: "Free Delivery Above ₹500",
    icon: "<path d='M3,4A2,2 0 0,0 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8H17V4M10,6L14,10L10,14V11H4V9H10M17,9.5H19.5L21.47,12H17M6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5M18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5Z'/>",
    order: 2,
    active: true,
    vertical: "freshcuts"
  },
  {
    text: "100% Fresh Guarantee",
    icon: "<path d='M12,2A3,3 0 0,1 15,5V7H9V5A3,3 0 0,1 12,2M19,7V5A7,7 0 0,0 5,5V7H3A1,1 0 0,0 2,8V20A3,3 0 0,0 5,23H19A3,3 0 0,0 22,20V8A1,1 0 0,0 21,7H19M12,12A2,2 0 0,1 14,14A2,2 0 0,1 12,16A2,2 0 0,1 10,14A2,2 0 0,1 12,12Z'/>",
    order: 3,
    active: true,
    vertical: "freshcuts"
  },
  {
    text: "Local Vendors",
    icon: "<path d='M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22S19,14.25 19,9A7,7 0 0,0 12,2Z'/>",
    order: 4,
    active: true,
    vertical: "freshcuts"
  },
  {
    text: "Open 6AM to 10PM",
    icon: "<path d='M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z'/>",
    order: 5,
    active: true,
    vertical: "freshcuts"
  }
];

const categoryCards = [
  {
    categoryId: "chicken",
    name: "Premium Chicken",
    description: "Farm-fresh poultry from local farms",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop&crop=center",
    active: true,
    vertical: "freshcuts"
  },
  {
    categoryId: "mutton",
    name: "Fresh Mutton",
    description: "Premium quality mutton cuts",
    image: "https://images.unsplash.com/photo-1588347818133-38c4106ca7b4?w=300&h=200&fit=crop&crop=center",
    active: true,
    vertical: "freshcuts"
  },
  {
    categoryId: "fish",
    name: "Ocean Fresh Fish",
    description: "Daily catch from local waters",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=200&fit=crop&crop=center",
    active: true,
    vertical: "freshcuts"
  }
];

async function seedContent() {
  try {
    // Seed banner ads
    for (const ad of bannerAds) {
      await addDoc(collection(db, 'bannerAds'), {
        ...ad,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added banner ad: ${ad.text}`);
    }

    // Seed category cards
    for (const card of categoryCards) {
      await addDoc(collection(db, 'categoryCards'), {
        ...card,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added category card: ${card.name}`);
    }

    console.log('Content seeded successfully!');
  } catch (error) {
    console.error('Error seeding content:', error);
  }
}

seedContent();