// Temporary mock data until Firestore is enabled
export const mockCategories = [
  {
    id: "1",
    name: "Beauty & Salon",
    description: "Hair, skincare & beauty treatments",
    icon: "Scissors",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
    is_active: true
  },
  {
    id: "2", 
    name: "Home Services",
    description: "Cleaning, repairs & maintenance",
    icon: "Home",
    gradient: "bg-gradient-to-br from-yellow-500 to-orange-500",
    is_active: true
  },
  {
    id: "3",
    name: "Wellness Services", 
    description: "Health, fitness & wellness",
    icon: "Activity",
    gradient: "bg-gradient-to-br from-green-500 to-teal-500",
    is_active: true
  }
];

export const mockServices = [
  {
    id: "1",
    title: "Hair Cut & Styling",
    category: "Beauty & Salon",
    subcategory: "Hair Services", 
    description: "Professional haircut with styling",
    price: 499,
    duration: "45 mins",
    image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    rating: 4.8,
    total_reviews: 256,
    service_type: "platform",
    is_active: true
  },
  {
    id: "2",
    title: "House Cleaning",
    category: "Home Services",
    subcategory: "Cleaning",
    description: "Deep cleaning service for homes", 
    price: 899,
    duration: "3 hours",
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    rating: 4.5,
    total_reviews: 234,
    service_type: "platform",
    is_active: true
  },
  {
    id: "3",
    title: "Yoga Session",
    category: "Wellness Services",
    subcategory: "Fitness",
    description: "Personal yoga training session",
    price: 799, 
    duration: "60 mins",
    image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400&h=300&fit=crop",
    rating: 4.8,
    total_reviews: 156,
    service_type: "platform",
    is_active: true
  }
];