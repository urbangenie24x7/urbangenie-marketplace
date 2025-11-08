import { useState } from "react";
import { Copy, ExternalLink, Users, Key, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { sampleUserCredentials } from '@/utils/seedUsers';

const AuthSetup = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const backendCode = `// Backend implementation (Node.js + Firebase Admin SDK)
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create Firebase Auth users
async function createAuthUsers() {
  const users = [
    { email: 'admin@urbangenie.com', password: 'Admin123!', displayName: 'Super Admin' },
    { email: 'manager@urbangenie.com', password: 'Manager123!', displayName: 'Operations Manager' },
    { email: 'rajesh.plumber@gmail.com', password: 'Vendor123!', displayName: 'Rajesh Kumar' },
    { email: 'priya.cleaner@gmail.com', password: 'Vendor123!', displayName: 'Priya Sharma' },
    { email: 'mohammed.ac@gmail.com', password: 'Vendor123!', displayName: 'Mohammed Ali' },
    { email: 'anita.customer@gmail.com', password: 'Customer123!', displayName: 'Anita Gupta' },
    { email: 'vikram.customer@gmail.com', password: 'Customer123!', displayName: 'Vikram Mehta' },
    { email: 'sarah.customer@gmail.com', password: 'Customer123!', displayName: 'Sarah Khan' },
    { email: 'amit.customer@gmail.com', password: 'Customer123!', displayName: 'Amit Patel' }
  ];

  for (const user of users) {
    try {
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true
      });
      console.log('Created user:', userRecord.uid, user.email);
    } catch (error) {
      console.error('Error creating user:', user.email, error.message);
    }
  }
}

createAuthUsers();`;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Firebase Authentication Setup</h1>
        <p className="text-gray-600">Create Firebase Authentication users for dashboard access</p>
      </div>

      {/* Current Status */}
      <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Firebase Auth Users Not Created</h3>
            <p className="text-sm text-yellow-700 mt-1">
              The "Seed Users" function only creates Firestore records for role management. 
              To create actual Firebase Authentication users, you need Firebase Admin SDK on the backend.
            </p>
          </div>
        </div>
      </Card>

      {/* Manual Creation Option */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Option 1: Manual Creation (Quick Setup)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Create users manually in Firebase Console for immediate testing:
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">1.</span>
            <span>Go to Firebase Console → Authentication → Users</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open('https://console.firebase.google.com/project/urbangenie24x7/authentication/users', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open Firebase Console
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">2.</span>
            <span>Click "Add User" and use the credentials below</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-3">Sample User Credentials:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleUserCredentials.map((user, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={
                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                    user.role === 'vendor' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {user.role}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(`${user.email}\n${user.password}`, index)}
                  >
                    <Copy className="w-3 h-3" />
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="text-sm space-y-1">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Password:</strong> {user.password}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Backend Implementation */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Option 2: Backend Implementation (Production Setup)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          For production, create users programmatically using Firebase Admin SDK:
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Prerequisites:</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Node.js backend server</li>
              <li>• Firebase Admin SDK installed: <code className="bg-gray-100 px-1 rounded">npm install firebase-admin</code></li>
              <li>• Service Account Key from Firebase Console</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Backend Code:</h4>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(backendCode, -1)}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Code
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
              {backendCode}
            </pre>
          </div>
        </div>
      </Card>

      {/* Steps */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Implementation Steps:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">1</span>
            <div>
              <strong>Get Service Account Key:</strong>
              <p className="text-gray-600">Firebase Console → Project Settings → Service Accounts → Generate New Private Key</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">2</span>
            <div>
              <strong>Create Backend Script:</strong>
              <p className="text-gray-600">Use the code above in a Node.js script</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">3</span>
            <div>
              <strong>Run Script:</strong>
              <p className="text-gray-600">Execute the script to create all Firebase Auth users</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">4</span>
            <div>
              <strong>Verify:</strong>
              <p className="text-gray-600">Check Firebase Console → Authentication → Users to confirm creation</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthSetup;