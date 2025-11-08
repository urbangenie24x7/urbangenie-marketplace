import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const getUserRole = async (user: any): Promise<string> => {
  try {
    // First check dashboard_users collection for role
    const dashboardUserRef = doc(db, 'dashboard_users', user.uid);
    const dashboardUserDoc = await getDoc(dashboardUserRef);
    
    if (dashboardUserDoc.exists()) {
      return dashboardUserDoc.data().role || 'customer';
    }

    // Check if user is a vendor by email
    const vendorsRef = collection(db, 'vendors');
    const vendorQuery = query(vendorsRef, where('email', '==', user.email));
    const vendorSnapshot = await getDocs(vendorQuery);
    
    if (!vendorSnapshot.empty) {
      return 'vendor';
    }

    // Check if user is admin by email
    if (user.email?.includes('admin@urbangenie.com') || user.email?.includes('manager@urbangenie.com')) {
      return 'admin';
    }

    // Default to customer
    return 'customer';
  } catch (error) {
    console.error('Error determining user role:', error);
    return 'customer';
  }
};

export const getRedirectPath = (role: string): string => {
  switch (role) {
    case 'admin':
    case 'manager':
      return '/admin';
    case 'vendor':
      return '/vendor/dashboard';
    case 'customer':
    default:
      return '/profile';
  }
};

export const redirectUserByRole = async (user: any): Promise<void> => {
  const role = await getUserRole(user);
  const redirectPath = getRedirectPath(role);
  window.location.href = redirectPath;
};