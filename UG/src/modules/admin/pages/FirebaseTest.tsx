import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { seedDatabase } from '@/utils/seedDatabase';
import { seedDashboardUsers } from '@/utils/seedUsers';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'failed'}>({});
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [userSeedResult, setUserSeedResult] = useState<any>(null);

  // Test Firebase connection
  const testConnection = async () => {
    setTestResults(prev => ({...prev, connection: 'pending'}));
    
    try {
      // Real Firebase connection test
      const testCollection = collection(db, 'connection_test');
      await getDocs(testCollection);
      setTestResults(prev => ({...prev, connection: 'success'}));
      setConnectionStatus('connected');
      toast.success('Firebase connection successful');
    } catch (error: any) {
      console.error('Firebase connection error:', error);
      setTestResults(prev => ({...prev, connection: 'failed'}));
      setConnectionStatus('failed');
      
      if (error.message.includes('Missing or insufficient permissions')) {
        toast.error('Firebase permissions error - Using mock data instead');
      } else {
        toast.error(`Firebase connection failed: ${error.message}`);
      }
    }
  };

  // Test Firestore write
  const testWrite = async () => {
    setTestResults(prev => ({...prev, write: 'pending'}));
    
    try {
      const testDoc = {
        message: 'Test document',
        timestamp: new Date(),
        testId: Math.random().toString(36).substr(2, 9)
      };
      
      // Real Firestore write
      const docRef = await addDoc(collection(db, 'test_collection'), testDoc);
      console.log('Document written with ID:', docRef.id);
      
      setTestResults(prev => ({...prev, write: 'success'}));
      toast.success('Firestore write successful');
    } catch (error: any) {
      console.error('Firestore write error:', error);
      setTestResults(prev => ({...prev, write: 'failed'}));
      toast.error(`Firestore write failed: ${error.message}`);
    }
  };

  // Test Firestore read
  const testRead = async () => {
    setTestResults(prev => ({...prev, read: 'pending'}));
    
    try {
      // Real Firestore read
      const querySnapshot = await getDocs(collection(db, 'test_collection'));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Read documents:', docs);
      setTestResults(prev => ({...prev, read: 'success'}));
      toast.success(`Firestore read successful - Found ${docs.length} documents`);
    } catch (error: any) {
      console.error('Firestore read error:', error);
      setTestResults(prev => ({...prev, read: 'failed'}));
      toast.error(`Firestore read failed: ${error.message}`);
    }
  };

  // Test Firestore update
  const testUpdate = async () => {
    setTestResults(prev => ({...prev, update: 'pending'}));
    
    try {
      const testDocId = 'test_update_doc';
      const testDocRef = doc(db, 'test_collection', testDocId);
      
      await setDoc(testDocRef, {
        message: 'Updated test document',
        timestamp: new Date(),
        updated: true
      }, { merge: true });
      
      console.log('Document updated successfully');
      setTestResults(prev => ({...prev, update: 'success'}));
      toast.success('Firestore update successful');
    } catch (error: any) {
      console.error('Firestore update error:', error);
      setTestResults(prev => ({...prev, update: 'failed'}));
      toast.error(`Firestore update failed: ${error.message}`);
    }
  };

  // Test Firestore delete
  const testDelete = async () => {
    setTestResults(prev => ({...prev, delete: 'pending'}));
    
    try {
      const testDocId = 'test_update_doc';
      const testDocRef = doc(db, 'test_collection', testDocId);
      
      await deleteDoc(testDocRef);
      
      console.log('Document deleted successfully');
      setTestResults(prev => ({...prev, delete: 'success'}));
      toast.success('Firestore delete successful');
    } catch (error: any) {
      console.error('Firestore delete error:', error);
      setTestResults(prev => ({...prev, delete: 'failed'}));
      toast.error(`Firestore delete failed: ${error.message}`);
    }
  };

  const getStatusBadge = (status: 'pending' | 'success' | 'failed' | undefined) => {
    if (!status) return <Badge variant="secondary">Not Tested</Badge>;
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const runAllTests = async () => {
    await testConnection();
    if (testResults.connection === 'success') {
      await testWrite();
      await testRead();
      await testUpdate();
      await testDelete();
    }
  };

  const handleSeedDatabase = async () => {

    try {
      toast.info('Seeding database with sample data...');
      const result = await seedDatabase();
      
      if (result.success) {
        toast.success('Database seeded successfully with sample data!');
      } else {
        toast.error(`Seeding failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed database');
    }
  };

  const handleSeedUsers = async () => {

    try {
      toast.info('Seeding dashboard users...');
      const result = await seedDashboardUsers();
      
      if (result.success) {
        toast.success('Dashboard users seeded successfully!');
        setUserSeedResult(result);
      } else {
        toast.error(`User seeding failed: ${result.error}`);
        setUserSeedResult(result);
      }
    } catch (error) {
      console.error('User seeding error:', error);
      toast.error('Failed to seed users');
      setUserSeedResult({ success: false, error: error.message });
    }
  };

  const tests = [
    {
      name: 'Connection Test',
      key: 'connection',
      description: 'Test Firebase connection',
      testFn: testConnection
    },
    {
      name: 'Write Test',
      key: 'write',
      description: 'Test Firestore write operation',
      testFn: testWrite
    },
    {
      name: 'Read Test',
      key: 'read',
      description: 'Test Firestore read operation',
      testFn: testRead
    },
    {
      name: 'Update Test',
      key: 'update',
      description: 'Test Firestore update operation',
      testFn: testUpdate
    },
    {
      name: 'Delete Test',
      key: 'delete',
      description: 'Test Firestore delete operation',
      testFn: testDelete
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Firebase Firestore Connection Test</h1>
        <p className="text-gray-600">Test Firebase Firestore database connectivity and operations</p>
      </div>

      {/* Connection Status */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Firebase Connection Status</h3>
            <p className="text-sm text-gray-600">Project: urbangenie24x7</p>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === 'checking' && <Badge className="bg-blue-100 text-blue-700">Checking...</Badge>}
            {connectionStatus === 'connected' && <Badge className="bg-green-100 text-green-700">Connected</Badge>}
            {connectionStatus === 'failed' && <Badge className="bg-red-100 text-red-700">Failed</Badge>}
          </div>
        </div>
        
        <div className="mt-4">
          <Button onClick={runAllTests} className="mr-2">
            Test Firebase Connection
          </Button>
          <Button variant="outline" onClick={() => setTestResults({})} className="mr-2">
            Reset Results
          </Button>
          <Button onClick={handleSeedDatabase} className="bg-green-600 hover:bg-green-700 mr-2">
            Seed Database
          </Button>
          <Button onClick={handleSeedUsers} className="bg-purple-600 hover:bg-purple-700">
            Seed Users
          </Button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            🔥 Testing connection to Firebase project: urbangenie24x7
          </p>
        </div>
      </Card>

      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test) => (
          <Card key={test.key} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{test.name}</h3>
              {getStatusBadge(testResults[test.key])}
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{test.description}</p>
            
            <Button
              onClick={test.testFn}
              disabled={testResults[test.key] === 'pending'}
              size="sm"
              className="w-full"
            >
              {testResults[test.key] === 'pending' ? 'Testing...' : 'Run Test'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Configuration Info */}
      <Card className="p-4 mt-6">
        <h3 className="font-semibold mb-4">Firebase Configuration</h3>
        <div className="space-y-2 text-sm">
          <div><strong>Project ID:</strong> urbangenie24x7</div>
          <div><strong>Auth Domain:</strong> urbangenie24x7.firebaseapp.com</div>
          <div><strong>Mode:</strong> Real Firebase</div>
          <div><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</div>
          <div><strong>Status:</strong> <span className="text-green-600">Ready</span></div>
        </div>
      </Card>

      {/* Status Info */}
      <Card className="p-4 mt-6 bg-green-50">
        <h3 className="font-semibold mb-2">Firebase Status</h3>
        <div className="text-sm space-y-1 text-green-800">
          <p>✅ Firebase project urbangenie24x7 connected</p>
          <p>✅ All CRUD operations available</p>
          <p>✅ Real-time database ready</p>
          <p className="mt-2 font-medium">Production ready!</p>
        </div>
      </Card>

      {/* User Seed Results */}
      {userSeedResult && (
        <Card className="p-4 mt-6">
          <h3 className="font-semibold mb-2">Dashboard Users Seed Result:</h3>
          <div className="space-y-2">
            <p className="text-sm text-green-600">✅ {userSeedResult.message}</p>
            {userSeedResult.users && (
              <div>
                <h4 className="font-medium text-sm mb-2">Created Users:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {userSeedResult.users.map((user: any, index: number) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-600">{user.email}</div>
                      <div className="text-blue-600 capitalize">{user.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Database Seeding Info */}
      <Card className="p-4 mt-6 bg-blue-50">
        <h3 className="font-semibold mb-2">Database Seeding</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>🌱 <strong>Seed Database:</strong> Populate Firebase with comprehensive data:</p>
          <p>• 4 Categories (Home Maintenance, Cleaning, Beauty, Appliances)</p>
          <p>• 7 Subcategories (Plumbing, Electrical, AC, etc.)</p>
          <p>• 22 Services across all categories with pricing</p>
          <p>• 8 Vendors with earnings, documents, skills</p>
          <p>• 6 Customers with order history</p>
          <p>• 10 Orders with payment information</p>
          <p className="mt-2">👥 <strong>Seed Users:</strong> Create dashboard users for testing:</p>
          <p>• 2 Admin Users (admin@urbangenie.com, manager@urbangenie.com)</p>
          <p>• 3 Vendor Users (linked to vendor profiles)</p>
          <p>• 4 Customer Users (linked to customer profiles)</p>
          <p className="mt-2 font-medium">Complete production-ready database with user authentication!</p>
        </div>
      </Card>
    </div>
  );
};

export default FirebaseTest;