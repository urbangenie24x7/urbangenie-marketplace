import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAQtrV9q2mi4tuoKkPbtDZlgjuvLQWSHD8',
  authDomain: 'urbangenie24x7.firebaseapp.com',
  projectId: 'urbangenie24x7',
  storageBucket: 'urbangenie24x7.appspot.com',
  messagingSenderId: '371106212419',
  appId: '1:371106212419:web:urbangenie-web-app'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const categoryCards = [
  {
    categoryId: 'chicken',
    name: 'Chicken',
    description: 'Fresh poultry from local farms',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop',
    active: true,
    order: 1,
    vertical: 'freshcuts'
  },
  {
    categoryId: 'mutton',
    name: 'Mutton',
    description: 'Premium mutton cuts',
    image: 'https://images.unsplash.com/photo-1588347818133-38c4106ca7b4?w=300&h=200&fit=crop',
    active: true,
    order: 2,
    vertical: 'freshcuts'
  },
  {
    categoryId: 'fish',
    name: 'Fish',
    description: 'Fresh fish from local waters',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=200&fit=crop',
    active: true,
    order: 3,
    vertical: 'freshcuts'
  }
]

async function seedCategoryCards() {
  try {
    console.log('Clearing existing category cards...')
    const existingCards = await getDocs(collection(db, 'categoryCards'))
    for (const doc of existingCards.docs) {
      await deleteDoc(doc.ref)
    }

    console.log('Adding category cards...')
    for (const card of categoryCards) {
      await addDoc(collection(db, 'categoryCards'), card)
      console.log(`Added: ${card.name}`)
    }

    console.log('Category cards seeded successfully!')
  } catch (error) {
    console.error('Error seeding category cards:', error)
  }
}

seedCategoryCards()