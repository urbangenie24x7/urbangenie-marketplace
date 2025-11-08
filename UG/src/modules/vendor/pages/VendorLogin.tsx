import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Mock implementation for development
import { toast } from 'sonner';
import { Phone, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VendorLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if vendor exists and is approved
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('phone', phone)
        .eq('verification_status', 'approved')
        .single();

      if (vendorError || !vendor) {
        toast.error('Invalid credentials or vendor not approved');
        return;
      }

      // For demo purposes, use phone as password
      // In production, implement proper password hashing
      if (password !== phone.slice(-4)) {
        toast.error('Invalid password');
        return;
      }

      // Store vendor session
      localStorage.setItem('vendorId', vendor.id);
      localStorage.setItem('vendorName', vendor.name);
      localStorage.setItem('vendorPhone', vendor.phone);

      toast.success('Login successful!');
      navigate('/vendor/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <CardTitle className="text-2xl font-bold">Vendor Login</CardTitle>
          <p className="text-gray-600">Access your vendor dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Demo: Use last 4 digits of your phone number
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/vendor/onboarding" className="text-blue-600 hover:underline">
                Apply to become a vendor
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}