import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const IntegrationTesting = () => {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'failed'}>({});
  const [testPhone, setTestPhone] = useState('+91 9876543210');
  const [testAmount, setTestAmount] = useState(799);

  // Mock integration functions with realistic scenarios
  const testSMS = async () => {
    setTestResults(prev => ({...prev, sms: 'pending'}));
    
    // Validate phone number format
    const phoneRegex = /^\+91\s?[6-9]\d{9}$/;
    if (!phoneRegex.test(testPhone)) {
      setTimeout(() => {
        setTestResults(prev => ({...prev, sms: 'failed'}));
        toast.error('Invalid phone number format');
      }, 1000);
      return;
    }
    
    // Simulate SMS API call with 20% failure rate
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        console.log(`SMS sent to ${testPhone}: Order confirmed #UG123457`);
        setTestResults(prev => ({...prev, sms: 'success'}));
        toast.success('SMS test successful');
      } else {
        console.error('SMS delivery failed - Network timeout');
        setTestResults(prev => ({...prev, sms: 'failed'}));
        toast.error('SMS test failed - Network timeout');
      }
    }, 2000);
  };

  const testPayment = async () => {
    setTestResults(prev => ({...prev, payment: 'pending'}));
    
    // Validate amount
    if (testAmount < 1 || testAmount > 100000) {
      setTimeout(() => {
        setTestResults(prev => ({...prev, payment: 'failed'}));
        toast.error('Invalid amount - Must be between ₹1 and ₹100,000');
      }, 1000);
      return;
    }
    
    // Simulate Razorpay integration with potential failures
    const mockRazorpay = {
      open: () => {
        setTimeout(() => {
          const scenarios = [
            { success: true, message: 'Payment successful', probability: 0.7 },
            { success: false, message: 'Payment failed - Insufficient funds', probability: 0.15 },
            { success: false, message: 'Payment failed - Network error', probability: 0.1 },
            { success: false, message: 'Payment cancelled by user', probability: 0.05 }
          ];
          
          const random = Math.random();
          let cumulative = 0;
          
          for (const scenario of scenarios) {
            cumulative += scenario.probability;
            if (random <= cumulative) {
              if (scenario.success) {
                console.log(`Payment of ₹${testAmount} processed successfully`);
                setTestResults(prev => ({...prev, payment: 'success'}));
                toast.success('Payment test successful');
              } else {
                console.error(scenario.message);
                setTestResults(prev => ({...prev, payment: 'failed'}));
                toast.error(scenario.message);
              }
              break;
            }
          }
        }, 3000);
      }
    };
    
    mockRazorpay.open();
  };

  const testWhatsApp = async () => {
    setTestResults(prev => ({...prev, whatsapp: 'pending'}));
    
    // Check if WhatsApp Business API is configured
    const hasWhatsAppConfig = process.env.REACT_APP_WHATSAPP_TOKEN;
    
    setTimeout(() => {
      if (!hasWhatsAppConfig) {
        console.error('WhatsApp Business API not configured');
        setTestResults(prev => ({...prev, whatsapp: 'failed'}));
        toast.error('WhatsApp API not configured');
        return;
      }
      
      // Simulate API call with 15% failure rate
      const success = Math.random() > 0.15;
      if (success) {
        console.log(`WhatsApp message sent to ${testPhone}`);
        setTestResults(prev => ({...prev, whatsapp: 'success'}));
        toast.success('WhatsApp test successful');
      } else {
        console.error('WhatsApp delivery failed - Rate limit exceeded');
        setTestResults(prev => ({...prev, whatsapp: 'failed'}));
        toast.error('WhatsApp test failed - Rate limit exceeded');
      }
    }, 1500);
  };

  const testMaps = async () => {
    setTestResults(prev => ({...prev, maps: 'pending'}));
    
    // Check if Google Maps API key is configured
    const hasGoogleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    setTimeout(() => {
      if (!hasGoogleMapsKey) {
        console.error('Google Maps API key not configured');
        setTestResults(prev => ({...prev, maps: 'failed'}));
        toast.error('Google Maps API key missing');
        return;
      }
      
      // Simulate geocoding with potential quota exceeded
      const quotaExceeded = Math.random() < 0.1;
      if (quotaExceeded) {
        console.error('Google Maps API quota exceeded');
        setTestResults(prev => ({...prev, maps: 'failed'}));
        toast.error('Maps API quota exceeded');
        return;
      }
      
      const mockGeocode = {
        lat: 17.4065,
        lng: 78.4691,
        address: "Banjara Hills, Hyderabad"
      };
      
      console.log('Geocoding result:', mockGeocode);
      setTestResults(prev => ({...prev, maps: 'success'}));
      toast.success('Maps API test successful');
    }, 1000);
  };

  const testPushNotification = async () => {
    setTestResults(prev => ({...prev, push: 'pending'}));
    
    // Check if FCM is configured
    const hasFCMConfig = process.env.REACT_APP_FCM_SERVER_KEY;
    
    setTimeout(() => {
      if (!hasFCMConfig) {
        console.error('FCM server key not configured');
        setTestResults(prev => ({...prev, push: 'failed'}));
        toast.error('FCM not configured');
        return;
      }
      
      // Simulate push notification with device offline scenario
      const deviceOffline = Math.random() < 0.25;
      if (deviceOffline) {
        console.warn('Push notification queued - Device offline');
        setTestResults(prev => ({...prev, push: 'success'}));
        toast.success('Push notification queued (device offline)');
      } else {
        console.log('Push notification sent: Vendor assigned to your order');
        setTestResults(prev => ({...prev, push: 'success'}));
        toast.success('Push notification delivered');
      }
    }, 1000);
  };

  const testFileUpload = async () => {
    setTestResults(prev => ({...prev, storage: 'pending'}));
    
    // Check if AWS S3 or storage is configured
    const hasStorageConfig = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
    
    setTimeout(() => {
      if (!hasStorageConfig) {
        console.error('Cloud storage not configured');
        setTestResults(prev => ({...prev, storage: 'failed'}));
        toast.error('Cloud storage not configured');
        return;
      }
      
      // Simulate file upload with potential failures
      const uploadScenarios = [
        { success: true, message: 'File uploaded successfully', probability: 0.8 },
        { success: false, message: 'Upload failed - File too large', probability: 0.1 },
        { success: false, message: 'Upload failed - Network timeout', probability: 0.1 }
      ];
      
      const random = Math.random();
      let cumulative = 0;
      
      for (const scenario of uploadScenarios) {
        cumulative += scenario.probability;
        if (random <= cumulative) {
          if (scenario.success) {
            console.log('File uploaded to cloud storage successfully');
            setTestResults(prev => ({...prev, storage: 'success'}));
            toast.success('File storage test successful');
          } else {
            console.error(scenario.message);
            setTestResults(prev => ({...prev, storage: 'failed'}));
            toast.error(scenario.message);
          }
          break;
        }
      }
    }, 2000);
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

  const integrations = [
    {
      name: 'SMS Service',
      key: 'sms',
      description: 'Test SMS notifications',
      testFn: testSMS,
      cost: '₹0.10 per SMS'
    },
    {
      name: 'Payment Gateway',
      key: 'payment',
      description: 'Test payment processing',
      testFn: testPayment,
      cost: '2% + ₹2 per transaction'
    },
    {
      name: 'WhatsApp API',
      key: 'whatsapp',
      description: 'Test WhatsApp messages',
      testFn: testWhatsApp,
      cost: '₹0.05 per message'
    },
    {
      name: 'Maps API',
      key: 'maps',
      description: 'Test geocoding & distance',
      testFn: testMaps,
      cost: '₹0.50 per 1000 requests'
    },
    {
      name: 'Push Notifications',
      key: 'push',
      description: 'Test mobile notifications',
      testFn: testPushNotification,
      cost: 'Free (FCM)'
    },
    {
      name: 'File Storage',
      key: 'storage',
      description: 'Test file upload',
      testFn: testFileUpload,
      cost: '₹100/month for 10GB'
    }
  ];

  const runAllTests = async () => {
    for (const integration of integrations) {
      await integration.testFn();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Integration Testing</h1>
        <p className="text-gray-600">Test all third-party integrations</p>
      </div>

      {/* Test Configuration */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-4">Test Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Test Phone Number</label>
            <Input
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+91 9876543210"
            />
            <p className="text-xs text-gray-500 mt-1">Format: +91 followed by 10 digits</p>
          </div>
          <div>
            <label className="text-sm font-medium">Test Amount</label>
            <Input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(parseInt(e.target.value))}
              placeholder="799"
              min="1"
              max="100000"
            />
            <p className="text-xs text-gray-500 mt-1">Range: ₹1 - ₹100,000</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <Button onClick={runAllTests}>
            Run All Tests
          </Button>
          <Button variant="outline" onClick={() => setTestResults({})}>
            Reset Results
          </Button>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ These are mock tests. Real integrations require API keys and configuration.
          </p>
        </div>
      </Card>

      {/* Integration Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.key} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{integration.name}</h3>
              {getStatusBadge(testResults[integration.key])}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
            <p className="text-xs text-blue-600 mb-4">{integration.cost}</p>
            
            <Button
              onClick={integration.testFn}
              disabled={testResults[integration.key] === 'pending'}
              size="sm"
              className="w-full"
            >
              {testResults[integration.key] === 'pending' ? 'Testing...' : 'Test Integration'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Test Results Summary */}
      <Card className="p-4 mt-6">
        <h3 className="font-semibold mb-4">Test Results Summary</h3>
        <div className="space-y-2">
          {integrations.map((integration) => (
            <div key={integration.key} className="flex items-center justify-between">
              <span>{integration.name}</span>
              {getStatusBadge(testResults[integration.key])}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default IntegrationTesting;