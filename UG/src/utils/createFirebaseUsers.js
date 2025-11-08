// Node.js script to create Firebase Authentication users
// Run this with: node src/utils/createFirebaseUsers.js

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Download service account key from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'urbangenie24x7'
});

const users = [
  // Admin Users
  { email: 'admin@urbangenie.com', password: 'Admin123!', displayName: 'Super Admin', role: 'admin' },
  { email: 'manager@urbangenie.com', password: 'Manager123!', displayName: 'Operations Manager', role: 'manager' },
  
  // Vendor Users
  { email: 'rajesh.plumber@gmail.com', password: 'Vendor123!', displayName: 'Rajesh Kumar', role: 'vendor' },
  { email: 'priya.cleaner@gmail.com', password: 'Vendor123!', displayName: 'Priya Sharma', role: 'vendor' },
  { email: 'mohammed.ac@gmail.com', password: 'Vendor123!', displayName: 'Mohammed Ali', role: 'vendor' },
  
  // Customer Users
  { email: 'anita.customer@gmail.com', password: 'Customer123!', displayName: 'Anita Gupta', role: 'customer' },
  { email: 'vikram.customer@gmail.com', password: 'Customer123!', displayName: 'Vikram Mehta', role: 'customer' },
  { email: 'sarah.customer@gmail.com', password: 'Customer123!', displayName: 'Sarah Khan', role: 'customer' },
  { email: 'amit.customer@gmail.com', password: 'Customer123!', displayName: 'Amit Patel', role: 'customer' }
];

async function createUsers() {
  console.log('Creating Firebase Authentication users...');
  
  for (const user of users) {
    try {
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true
      });
      
      // Set custom claims for role-based access
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        role: user.role
      });
      
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`- User already exists: ${user.email}`);
      } else {
        console.error(`✗ Error creating user ${user.email}:`, error.message);
      }
    }
  }
  
  console.log('\nUser creation completed!');
  process.exit(0);
}

createUsers().catch(console.error);