import { createDocument } from '../lib/firestore';

const sampleServices = [
  // Beauty & Salon Services
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
    rating: 4.9,
    total_reviews: 142
  },
  {
    title: 'Manicure & Pedicure',
    category: 'Beauty & Salon',
    subcategory: 'Nail Care',
    description: 'Complete nail care with gel polish',
    price: 699,
    duration: '90 mins',
    image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 10,
    rating: 4.7,
    total_reviews: 89
  },

  // Home Services
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
    rating: 4.6,
    total_reviews: 234
  },
  {
    title: 'AC Repair & Service',
    category: 'Home Services',
    subcategory: 'Repairs',
    description: 'Professional AC repair and maintenance service',
    price: 799,
    duration: '2 hours',
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 0,
    rating: 4.5,
    total_reviews: 167
  },
  {
    title: 'Plumbing Service',
    category: 'Home Services',
    subcategory: 'Plumbing',
    description: 'Expert plumbing solutions for all your needs',
    price: 599,
    duration: '1-2 hours',
    image_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 0,
    rating: 4.4,
    total_reviews: 198
  },

  // Wellness Services
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
    title: 'Full Body Massage',
    category: 'Wellness Services',
    subcategory: 'Massage',
    description: 'Relaxing full body massage therapy',
    price: 1199,
    duration: '90 mins',
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 25,
    rating: 4.9,
    total_reviews: 203
  },
  {
    title: 'Personal Fitness Training',
    category: 'Wellness Services',
    subcategory: 'Fitness',
    description: 'Customized fitness training with professional trainer',
    price: 999,
    duration: '60 mins',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 0,
    rating: 4.7,
    total_reviews: 124
  },

  // Food & Beverages
  {
    title: 'Fresh Fruit Delivery',
    category: 'Food & Beverages',
    subcategory: 'Fresh Food',
    description: 'Daily fresh fruits delivered to your doorstep',
    price: 299,
    duration: 'Same day',
    image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
    service_type: 'vendor_product',
    vendor_price: 250,
    platform_margin_percentage: 20,
    stock_quantity: 50,
    product_sku: 'FRUIT-001',
    is_active: true,
    discount_percentage: 0,
    rating: 4.6,
    total_reviews: 89,
    requires_delivery: true,
    free_delivery_radius_km: 5,
    delivery_rate_per_km: 15,
    max_delivery_radius_km: 20
  },
  {
    title: 'Party Catering Service',
    category: 'Food & Beverages',
    subcategory: 'Catering',
    description: 'Complete catering service for parties and events',
    price: 2999,
    duration: '4-6 hours',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 10,
    rating: 4.8,
    total_reviews: 67
  },

  // Electronics & Gadgets
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
  },
  {
    title: 'TV Installation & Setup',
    category: 'Electronics & Gadgets',
    subcategory: 'Installation',
    description: 'Professional TV mounting and setup service',
    price: 699,
    duration: '1-2 hours',
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    service_type: 'platform',
    is_active: true,
    discount_percentage: 0,
    rating: 4.7,
    total_reviews: 98
  }
];

export const seedServices = async () => {
  try {
    console.log('Starting to seed services...');
    
    for (const service of sampleServices) {
      // Calculate discounted price if discount exists
      const serviceData = {
        ...service,
        discounted_price: service.discount_percentage > 0 
          ? service.price * (1 - service.discount_percentage / 100)
          : null,
        platform_fee: service.service_type === 'vendor_product' && service.vendor_price
          ? service.vendor_price * (service.platform_margin_percentage || 20) / 100
          : null
      };

      await createDocument('services', serviceData);
      console.log(`✓ Added service: ${service.title}`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleServices.length} services!`);
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedServices();
}