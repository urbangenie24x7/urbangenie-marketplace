import { db } from '@/lib/firebase';
import { setDoc, doc } from 'firebase/firestore';

const categories = [
  {
    id: "cat_001",
    name: "Home Maintenance",
    description: "Essential home repair and maintenance services",
    icon: "🔧",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "cat_002",
    name: "Cleaning",
    description: "Professional cleaning services for homes and offices",
    icon: "🧹",
    isActive: true,
    sortOrder: 2
  },
  {
    id: "cat_003",
    name: "Beauty & Wellness",
    description: "Personal care and wellness services",
    icon: "💆",
    isActive: true,
    sortOrder: 3
  },
  {
    id: "cat_004",
    name: "Appliance Repair",
    description: "Repair services for home appliances",
    icon: "🔌",
    isActive: true,
    sortOrder: 4
  }
];

const subcategories = [
  {
    id: "sub_001",
    name: "Plumbing",
    categoryId: "cat_001",
    description: "Water pipe repairs, installations, and maintenance",
    isActive: true
  },
  {
    id: "sub_002",
    name: "Electrical",
    categoryId: "cat_001",
    description: "Electrical repairs, wiring, and installations",
    isActive: true
  },
  {
    id: "sub_003",
    name: "AC Services",
    categoryId: "cat_001",
    description: "Air conditioning repair, installation, and maintenance",
    isActive: true
  },
  {
    id: "sub_004",
    name: "Regular Cleaning",
    categoryId: "cat_002",
    description: "Daily and weekly house cleaning services",
    isActive: true
  },
  {
    id: "sub_005",
    name: "Deep Cleaning",
    categoryId: "cat_002",
    description: "Thorough cleaning for homes and offices",
    isActive: true
  },
  {
    id: "sub_006",
    name: "Salon at Home",
    categoryId: "cat_003",
    description: "Professional beauty services at your doorstep",
    isActive: true
  },
  {
    id: "sub_007",
    name: "Washing Machine",
    categoryId: "cat_004",
    description: "Washing machine repair and maintenance",
    isActive: true
  }
];

const adminUsers = [
  {
    id: "admin_001",
    name: "Super Admin",
    email: "admin@urbangenie.com",
    role: "super_admin",
    permissions: ["all"],
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "admin_002",
    name: "Operations Manager",
    email: "ops@urbangenie.com",
    role: "operations",
    permissions: ["orders", "vendors", "customers"],
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z"
  }
];

const systemSettings = [
  {
    id: "settings_001",
    key: "platform_commission",
    value: "15",
    description: "Platform commission percentage",
    type: "number"
  },
  {
    id: "settings_002",
    key: "max_travel_radius",
    value: "50",
    description: "Maximum travel radius in kilometers",
    type: "number"
  },
  {
    id: "settings_003",
    key: "auto_assign_orders",
    value: "true",
    description: "Automatically assign orders to nearest vendors",
    type: "boolean"
  }
];

const vendors = [
  {
    id: "vendor_001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 9876543210",
    skills: ["Plumbing", "Electrical"],
    categories: ["cat_001"],
    subcategories: ["sub_001", "sub_002"],
    location: { lat: 28.6139, lng: 77.2090, address: "Connaught Place, New Delhi" },
    rating: 4.8,
    completedJobs: 156,
    status: "approved",
    joinDate: "2023-01-15",
    vehicleType: "Bike",
    travelRadius: 15,
    isAvailable: true,
    documents: { aadhar: "verified", pan: "verified", bankAccount: "verified" },
    earnings: { thisMonth: 25000, lastMonth: 22000, total: 180000 }
  },
  {
    id: "vendor_002",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 9876543211",
    skills: ["House Cleaning", "Deep Cleaning"],
    categories: ["cat_002"],
    subcategories: ["sub_004", "sub_005"],
    location: { lat: 28.5355, lng: 77.3910, address: "Sector 18, Noida" },
    rating: 4.9,
    completedJobs: 203,
    status: "approved",
    joinDate: "2023-02-20",
    vehicleType: "Car",
    travelRadius: 20,
    isAvailable: true,
    documents: { aadhar: "verified", pan: "verified", bankAccount: "verified" },
    earnings: { thisMonth: 32000, lastMonth: 28000, total: 245000 }
  },
  {
    id: "vendor_003",
    name: "Mohammed Ali",
    email: "mohammed.ali@email.com",
    phone: "+91 9876543212",
    skills: ["AC Repair", "AC Installation"],
    categories: ["cat_001"],
    subcategories: ["sub_003"],
    location: { lat: 28.4595, lng: 77.0266, address: "Gurgaon Sector 29" },
    rating: 4.7,
    completedJobs: 89,
    status: "approved",
    joinDate: "2023-03-10",
    vehicleType: "Van",
    travelRadius: 25,
    isAvailable: true,
    documents: { aadhar: "verified", pan: "pending", bankAccount: "verified" },
    earnings: { thisMonth: 18000, lastMonth: 15000, total: 95000 }
  }
];

const customers = [
  {
    id: "customer_001",
    name: "Anita Gupta",
    email: "anita.gupta@email.com",
    phone: "+91 9123456789",
    address: "A-123, Vasant Kunj, New Delhi",
    location: { lat: 28.5200, lng: 77.1590 },
    joinDate: "2023-06-15",
    totalOrders: 12
  },
  {
    id: "customer_002",
    name: "Vikram Mehta",
    email: "vikram.mehta@email.com",
    phone: "+91 9123456790",
    address: "B-456, Sector 62, Noida",
    location: { lat: 28.6270, lng: 77.3716 },
    joinDate: "2023-07-20",
    totalOrders: 8
  }
];

const services = [
  // Plumbing Services
  {
    id: "service_001",
    name: "Pipe Repair",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "Plumbing",
    subcategoryId: "sub_001",
    description: "Fix leaking pipes and water damage",
    basePrice: 500,
    duration: 60,
    isActive: true,
    requirements: ["Pipe fittings", "Tools", "Sealants"]
  },
  {
    id: "service_002",
    name: "Toilet Installation",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "Plumbing",
    subcategoryId: "sub_001",
    description: "Complete toilet installation service",
    basePrice: 800,
    duration: 120,
    isActive: true,
    requirements: ["Toilet fixtures", "Installation tools"]
  },
  {
    id: "service_003",
    name: "Tap & Faucet Repair",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "Plumbing",
    subcategoryId: "sub_001",
    description: "Fix dripping taps and faucets",
    basePrice: 300,
    duration: 45,
    isActive: true,
    requirements: ["Washers", "O-rings", "Basic tools"]
  },
  // Electrical Services
  {
    id: "service_004",
    name: "Wiring Installation",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "Electrical",
    subcategoryId: "sub_002",
    description: "New electrical wiring installation",
    basePrice: 1200,
    duration: 180,
    isActive: true,
    requirements: ["Electrical wires", "Conduits", "Safety gear"]
  },
  {
    id: "service_005",
    name: "Switch & Socket Repair",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "Electrical",
    subcategoryId: "sub_002",
    description: "Fix faulty switches and sockets",
    basePrice: 400,
    duration: 60,
    isActive: true,
    requirements: ["Switches", "Sockets", "Electrical tools"]
  },
  {
    id: "service_006",
    name: "Fan Installation",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "Electrical",
    subcategoryId: "sub_002",
    description: "Ceiling fan installation and repair",
    basePrice: 600,
    duration: 90,
    isActive: true,
    requirements: ["Mounting hardware", "Electrical connections"]
  },
  // AC Services
  {
    id: "service_007",
    name: "AC Gas Filling",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "AC Services",
    subcategoryId: "sub_003",
    description: "Professional AC gas refilling",
    basePrice: 1200,
    duration: 90,
    isActive: true,
    requirements: ["Refrigerant gas", "Pressure gauge", "Tools"]
  },
  {
    id: "service_008",
    name: "AC Installation",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "AC Services",
    subcategoryId: "sub_003",
    description: "Complete AC unit installation",
    basePrice: 2000,
    duration: 240,
    isActive: true,
    requirements: ["Mounting brackets", "Copper pipes", "Installation kit"]
  },
  {
    id: "service_009",
    name: "AC Cleaning",
    category: "Home Maintenance",
    categoryId: "cat_001",
    subcategory: "AC Services",
    subcategoryId: "sub_003",
    description: "Deep cleaning of AC units",
    basePrice: 800,
    duration: 120,
    isActive: true,
    requirements: ["Cleaning chemicals", "Pressure washer"]
  },
  // Regular Cleaning Services
  {
    id: "service_010",
    name: "House Cleaning",
    category: "Cleaning",
    categoryId: "cat_002",
    subcategory: "Regular Cleaning",
    subcategoryId: "sub_004",
    description: "Complete house cleaning service",
    basePrice: 800,
    duration: 120,
    isActive: true,
    requirements: ["Cleaning supplies", "Vacuum cleaner"]
  },
  {
    id: "service_011",
    name: "Kitchen Cleaning",
    category: "Cleaning",
    categoryId: "cat_002",
    subcategory: "Regular Cleaning",
    subcategoryId: "sub_004",
    description: "Specialized kitchen deep cleaning",
    basePrice: 600,
    duration: 90,
    isActive: true,
    requirements: ["Degreasing agents", "Scrubbing tools"]
  },
  {
    id: "service_012",
    name: "Bathroom Cleaning",
    category: "Cleaning",
    categoryId: "cat_002",
    subcategory: "Regular Cleaning",
    subcategoryId: "sub_004",
    description: "Thorough bathroom sanitization",
    basePrice: 500,
    duration: 75,
    isActive: true,
    requirements: ["Disinfectants", "Tile cleaners"]
  },
  // Deep Cleaning Services
  {
    id: "service_013",
    name: "Deep House Cleaning",
    category: "Cleaning",
    categoryId: "cat_002",
    subcategory: "Deep Cleaning",
    subcategoryId: "sub_005",
    description: "Comprehensive deep cleaning service",
    basePrice: 1500,
    duration: 240,
    isActive: true,
    requirements: ["Professional equipment", "Specialized chemicals"]
  },
  {
    id: "service_014",
    name: "Carpet Cleaning",
    category: "Cleaning",
    categoryId: "cat_002",
    subcategory: "Deep Cleaning",
    subcategoryId: "sub_005",
    description: "Professional carpet deep cleaning",
    basePrice: 1000,
    duration: 180,
    isActive: true,
    requirements: ["Carpet shampoo", "Steam cleaner"]
  },
  {
    id: "service_015",
    name: "Sofa Cleaning",
    category: "Cleaning",
    categoryId: "cat_002",
    subcategory: "Deep Cleaning",
    subcategoryId: "sub_005",
    description: "Upholstery and sofa cleaning",
    basePrice: 800,
    duration: 120,
    isActive: true,
    requirements: ["Upholstery cleaner", "Steam equipment"]
  },
  // Beauty & Wellness Services
  {
    id: "service_016",
    name: "Hair Cut & Styling",
    category: "Beauty & Wellness",
    categoryId: "cat_003",
    subcategory: "Salon at Home",
    subcategoryId: "sub_006",
    description: "Professional hair cutting and styling",
    basePrice: 800,
    duration: 90,
    isActive: true,
    requirements: ["Hair tools", "Styling products"]
  },
  {
    id: "service_017",
    name: "Facial Treatment",
    category: "Beauty & Wellness",
    categoryId: "cat_003",
    subcategory: "Salon at Home",
    subcategoryId: "sub_006",
    description: "Rejuvenating facial treatment",
    basePrice: 1200,
    duration: 120,
    isActive: true,
    requirements: ["Facial products", "Steamer"]
  },
  {
    id: "service_018",
    name: "Bridal Makeup",
    category: "Beauty & Wellness",
    categoryId: "cat_003",
    subcategory: "Salon at Home",
    subcategoryId: "sub_006",
    description: "Complete bridal makeup service",
    basePrice: 3000,
    duration: 180,
    isActive: true,
    requirements: ["Professional makeup kit", "Hair accessories"]
  },
  {
    id: "service_019",
    name: "Manicure & Pedicure",
    category: "Beauty & Wellness",
    categoryId: "cat_003",
    subcategory: "Salon at Home",
    subcategoryId: "sub_006",
    description: "Complete nail care service",
    basePrice: 600,
    duration: 90,
    isActive: true,
    requirements: ["Nail care kit", "Polish"]
  },
  // Appliance Repair Services
  {
    id: "service_020",
    name: "Washing Machine Repair",
    category: "Appliance Repair",
    categoryId: "cat_004",
    subcategory: "Washing Machine",
    subcategoryId: "sub_007",
    description: "Complete washing machine repair",
    basePrice: 700,
    duration: 120,
    isActive: true,
    requirements: ["Spare parts", "Repair tools"]
  },
  {
    id: "service_021",
    name: "Washing Machine Installation",
    category: "Appliance Repair",
    categoryId: "cat_004",
    subcategory: "Washing Machine",
    subcategoryId: "sub_007",
    description: "New washing machine setup",
    basePrice: 500,
    duration: 90,
    isActive: true,
    requirements: ["Installation kit", "Water connections"]
  },
  {
    id: "service_022",
    name: "Washing Machine Maintenance",
    category: "Appliance Repair",
    categoryId: "cat_004",
    subcategory: "Washing Machine",
    subcategoryId: "sub_007",
    description: "Preventive maintenance service",
    basePrice: 400,
    duration: 60,
    isActive: true,
    requirements: ["Cleaning agents", "Maintenance tools"]
  }
];

const orders = [
  {
    id: "order_001",
    customer: "Anita Gupta",
    customerId: "customer_001",
    phone: "+91 9123456789",
    service: "House Cleaning",
    serviceId: "service_002",
    amount: 800,
    status: "Completed",
    date: "2024-01-15",
    time: "10:00 AM",
    address: "A-123, Vasant Kunj, New Delhi",
    location: { lat: 28.5200, lng: 77.1590 },
    assignedVendor: "Priya Sharma",
    vendorId: "vendor_002"
  },
  {
    id: "order_002",
    customer: "Vikram Mehta",
    customerId: "customer_002",
    phone: "+91 9123456790",
    service: "AC Gas Filling",
    serviceId: "service_003",
    amount: 1200,
    status: "In Progress",
    date: "2024-01-20",
    time: "2:00 PM",
    address: "B-456, Sector 62, Noida",
    location: { lat: 28.6270, lng: 77.3716 },
    assignedVendor: "Mohammed Ali",
    vendorId: "vendor_003"
  },
  {
    id: "order_003",
    customer: "Anita Gupta",
    customerId: "customer_001",
    phone: "+91 9123456789",
    service: "Plumbing",
    serviceId: "service_001",
    amount: 500,
    status: "Pending",
    date: "2024-01-25",
    time: "11:00 AM",
    address: "A-123, Vasant Kunj, New Delhi",
    location: { lat: 28.5200, lng: 77.1590 }
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), category);
    }

    for (const subcategory of subcategories) {
      await setDoc(doc(db, 'subcategories', subcategory.id), subcategory);
    }

    for (const admin of adminUsers) {
      await setDoc(doc(db, 'admin_users', admin.id), admin);
    }

    for (const setting of systemSettings) {
      await setDoc(doc(db, 'system_settings', setting.id), setting);
    }

    for (const vendor of vendors) {
      await setDoc(doc(db, 'vendors', vendor.id), vendor);
    }

    for (const customer of customers) {
      await setDoc(doc(db, 'customers', customer.id), customer);
    }

    for (const service of services) {
      await setDoc(doc(db, 'services', service.id), service);
    }

    for (const order of orders) {
      await setDoc(doc(db, 'orders', order.id), order);
    }

    console.log('Database seeding completed!');
    return { success: true, message: 'All sample data added to database' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error.message };
  }
};