import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, User, Mail, Key, Shield } from "lucide-react";
import { testCredentials } from "@/utils/seedUsers";

const AuthDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Methods</h1>
          <p className="text-white/80">UrbanGenie supports multiple authentication methods</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Phone Authentication */}
          <Card className="p-6">
            <div className="text-center mb-4">
              <Phone className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Phone Authentication</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in with your mobile number via OTP
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                OTP: {testCredentials.phone.otp}
              </Badge>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Sample Numbers:</p>
                {testCredentials.phone.numbers.slice(0, 3).map(number => (
                  <p key={number}>{number}</p>
                ))}
                <p className="text-primary">+ {testCredentials.phone.numbers.length - 3} more</p>
              </div>
            </div>
          </Card>

          {/* Username/Email Authentication */}
          <Card className="p-6">
            <div className="text-center mb-4">
              <User className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Username/Email</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in with username or email and password
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                Password: {testCredentials.username.password}
              </Badge>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Sample Usernames:</p>
                {testCredentials.username.accounts.slice(0, 3).map(username => (
                  <p key={username}>{username}</p>
                ))}
                <p className="text-primary">+ {testCredentials.username.accounts.length - 3} more</p>
              </div>
            </div>
          </Card>

          {/* Google Authentication */}
          <Card className="p-6">
            <div className="text-center mb-4">
              <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Google Sign-In</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Quick sign-in with your Google account
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                {testCredentials.google.enabled ? "Enabled" : "Disabled"}
              </Badge>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Mock User:</p>
                <p>{testCredentials.google.mockUser.email}</p>
                <p>{testCredentials.google.mockUser.displayName}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* User Roles */}
        <Card className="p-6 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-xl font-semibold">User Roles & Access</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="mb-2">Admin</Badge>
              <p className="text-sm text-muted-foreground">Full system access</p>
              <div className="text-xs mt-2">
                <p>admin@urbangenie.com</p>
                <p>username: admin</p>
              </div>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Manager</Badge>
              <p className="text-sm text-muted-foreground">Operations management</p>
              <div className="text-xs mt-2">
                <p>manager@urbangenie.com</p>
                <p>username: manager</p>
              </div>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Vendor</Badge>
              <p className="text-sm text-muted-foreground">Service provider</p>
              <div className="text-xs mt-2">
                <p>rajesh_plumber</p>
                <p>priya_cleaner</p>
                <p>mohammed_ac</p>
              </div>
            </div>
            <div className="text-center">
              <Badge variant="destructive" className="mb-2">Customer</Badge>
              <p className="text-sm text-muted-foreground">Service consumer</p>
              <div className="text-xs mt-2">
                <p>anita_gupta</p>
                <p>vikram_mehta</p>
                <p>sarah_khan</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Development Notes */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Key className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-xl font-semibold">Development Mode</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Phone Authentication:</strong> Use OTP <code className="bg-muted px-1 rounded">123456</code> for any phone number
            </p>
            <p>
              <strong>Username/Email:</strong> Use password <code className="bg-muted px-1 rounded">password123</code> for any account
            </p>
            <p>
              <strong>Google Sign-In:</strong> Mock authentication enabled for development
            </p>
            <p>
              <strong>Firebase:</strong> Falls back to mock data when Firebase is unavailable
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthDemo;