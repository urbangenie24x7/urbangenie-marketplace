import { db } from '@/lib/firebase';
import { setDoc, doc } from 'firebase/firestore';

// Sample users for different dashboards with authentication methods
const dashboardUsers = [
  // Admin Users
  {
    id: "admin_user_001",
    email: "admin@urbangenie.com",
    username: "admin",
    phone: "+919876543210",
    displayName: "Super Admin",
    role: "admin",
    permissions: ["all"],
    authMethods: ["email", "phone", "username"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["admin"]
  },
  {
    id: "admin_user_002", 
    email: "manager@urbangenie.com",
    username: "manager",
    phone: "+919876543211",
    displayName: "Operations Manager",
    role: "manager",
    permissions: ["orders", "vendors", "customers"],
    authMethods: ["email", "phone", "google"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["admin"]
  },
  
  // Vendor Users
  {
    id: "vendor_user_001",
    email: "rajesh.plumber@gmail.com",
    username: "rajesh_plumber",
    phone: "+919876543220",
    displayName: "Rajesh Kumar",
    role: "vendor",
    vendorId: "vendor_001",
    skills: ["Plumbing", "Electrical"],
    authMethods: ["email", "phone"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["vendor"]
  },
  {
    id: "vendor_user_002",
    email: "priya.cleaner@gmail.com", 
    username: "priya_cleaner",
    phone: "+919876543221",
    displayName: "Priya Sharma",
    role: "vendor",
    vendorId: "vendor_002",
    skills: ["House Cleaning", "Deep Cleaning"],
    authMethods: ["email", "phone", "google"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["vendor"]
  },
  {
    id: "vendor_user_003",
    email: "mohammed.ac@gmail.com",
    username: "mohammed_ac",
    phone: "+919876543222",
    displayName: "Mohammed Ali",
    role: "vendor", 
    vendorId: "vendor_003",
    skills: ["AC Repair", "AC Installation"],
    authMethods: ["phone", "google"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["vendor"]
  },
  
  // Customer Users
  {
    id: "customer_user_001",
    email: "anita.customer@gmail.com",
    username: "anita_gupta",
    displayName: "Anita Gupta",
    role: "customer",
    customerId: "customer_001",
    phone: "+919123456789",
    address: "A-123, Vasant Kunj, New Delhi",
    authMethods: ["email", "phone", "google"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["customer"]
  },
  {
    id: "customer_user_002",
    email: "vikram.customer@gmail.com",
    username: "vikram_mehta",
    displayName: "Vikram Mehta", 
    role: "customer",
    customerId: "customer_002",
    phone: "+919123456790",
    address: "B-456, Sector 62, Noida",
    authMethods: ["google", "email"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["customer"]
  },
  {
    id: "customer_user_003",
    email: "sarah.customer@gmail.com",
    username: "sarah_khan",
    displayName: "Sarah Khan",
    role: "customer",
    customerId: "customer_003",
    phone: "+919123456791",
    address: "C-789, Banjara Hills, Hyderabad",
    authMethods: ["phone", "email"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["customer"]
  },
  {
    id: "customer_user_004",
    email: "amit.customer@gmail.com",
    username: "amit_patel",
    displayName: "Amit Patel",
    role: "customer",
    customerId: "customer_004", 
    phone: "+919123456792",
    address: "D-101, Koramangala, Bangalore",
    authMethods: ["google"],
    isActive: true,
    createdAt: new Date().toISOString(),
    dashboardAccess: ["customer"]
  }
];

export const seedDashboardUsers = async () => {
  try {
    console.log('Starting dashboard users seeding...');

    // Add users to Firestore (for dashboard access control)
    for (const user of dashboardUsers) {
      await setDoc(doc(db, 'dashboard_users', user.id), user);
    }

    console.log('Dashboard users seeding completed!');
    return { 
      success: true, 
      message: `Added ${dashboardUsers.length} dashboard users to Firestore (not Firebase Auth)`,
      users: dashboardUsers.map(u => ({ email: u.email, role: u.role, name: u.displayName })),
      note: "To create Firebase Authentication users, you need Firebase Admin SDK on backend"
    };
  } catch (error) {
    console.error('Error seeding dashboard users:', error);
    return { success: false, error: error.message };
  }
};

// Instructions for creating Firebase Auth users
export const createFirebaseAuthUsers = `
// Backend implementation needed (Node.js with Firebase Admin SDK)

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to create Firebase Auth users
async function createAuthUsers() {
  const users = [
    { email: 'admin@urbangenie.com', password: 'Admin123!', displayName: 'Super Admin' },
    { email: 'manager@urbangenie.com', password: 'Manager123!', displayName: 'Operations Manager' },
    { email: 'rajesh.plumber@gmail.com', password: 'Vendor123!', displayName: 'Rajesh Kumar' },
    // ... more users
  ];

  for (const user of users) {
    try {
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true
      });
      console.log('Created user:', userRecord.uid);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }
}

// Call the function
createAuthUsers();
`;

// User roles and permissions
export const userRoles = {
  admin: {
    name: "Administrator",
    permissions: ["all"],
    dashboards: ["admin"]
  },
  manager: {
    name: "Operations Manager", 
    permissions: ["orders", "vendors", "customers", "services"],
    dashboards: ["admin"]
  },
  vendor: {
    name: "Service Vendor",
    permissions: ["orders", "profile", "earnings"],
    dashboards: ["vendor"]
  },
  customer: {
    name: "Customer",
    permissions: ["orders", "profile", "bookings"],
    dashboards: ["customer"]
  }
};

// Sample credentials for manual Firebase Auth user creation
export const sampleUserCredentials = [
  { email: 'admin@urbangenie.com', username: 'admin', phone: '+919876543210', password: 'Admin123!', role: 'admin' },
  { email: 'manager@urbangenie.com', username: 'manager', phone: '+919876543211', password: 'Manager123!', role: 'manager' },
  { email: 'rajesh.plumber@gmail.com', username: 'rajesh_plumber', phone: '+919876543220', password: 'Vendor123!', role: 'vendor' },
  { email: 'priya.cleaner@gmail.com', username: 'priya_cleaner', phone: '+919876543221', password: 'Vendor123!', role: 'vendor' },
  { email: 'mohammed.ac@gmail.com', username: 'mohammed_ac', phone: '+919876543222', password: 'Vendor123!', role: 'vendor' },
  { email: 'anita.customer@gmail.com', username: 'anita_gupta', phone: '+919123456789', password: 'Customer123!', role: 'customer' },
  { email: 'vikram.customer@gmail.com', username: 'vikram_mehta', phone: '+919123456790', password: 'Customer123!', role: 'customer' },
  { email: 'sarah.customer@gmail.com', username: 'sarah_khan', phone: '+919123456791', password: 'Customer123!', role: 'customer' },
  { email: 'amit.customer@gmail.com', username: 'amit_patel', phone: '+919123456792', password: 'Customer123!', role: 'customer' }
];

// Test credentials for development mode
export const testCredentials = {
  phone: {
    otp: '123456', // Use this OTP for any phone number in development
    numbers: ['+919876543210', '+919876543211', '+919876543220', '+919876543221', '+919876543222', '+919123456789', '+919123456790', '+919123456791', '+919123456792']
  },
  username: {
    password: 'password123', // Use this password for any username/email in development
    accounts: ['admin', 'manager', 'rajesh_plumber', 'priya_cleaner', 'mohammed_ac', 'anita_gupta', 'vikram_mehta', 'sarah_khan', 'amit_patel']
  },
  google: {
    enabled: true, // Google sign-in available in development
    mockUser: { email: 'user@gmail.com', displayName: 'Google User', uid: 'google-mock-user' }
  }
};

// Helper function to get user by email
export const getUserByEmail = (email: string) => {
  return dashboardUsers.find(user => user.email === email);
};

// Helper function to get user by username
export const getUserByUsername = (username: string) => {
  return dashboardUsers.find(user => user.username === username);
};

// Helper function to get user by phone
export const getUserByPhone = (phone: string) => {
  return dashboardUsers.find(user => user.phone === phone);
};

// Helper function to check user permissions
export const hasPermission = (userRole: string, permission: string) => {
  const role = userRoles[userRole];
  return role?.permissions.includes("all") || role?.permissions.includes(permission);
};