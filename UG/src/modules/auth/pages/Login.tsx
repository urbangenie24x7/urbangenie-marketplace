import { useState, useEffect } from "react";
import { Phone, ArrowRight, Shield, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";
import { redirectUserByRole } from "@/utils/roleRedirect";

const Login = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [activeTab, setActiveTab] = useState("phone");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Login component mounted');
    // Check if Firebase is configured
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN', 
      'VITE_FIREBASE_PROJECT_ID'
    ];
    
    const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
    if (missing.length > 0) {
      setError(`Missing environment variables: ${missing.join(', ')}`);
    }
  }, []);

  let authHook;
  try {
    authHook = useAuth();
  } catch (err) {
    console.error('Auth hook error:', err);
    setError('Firebase configuration error');
    authHook = { sendOTP: () => {}, verifyOTP: () => {}, signInWithGoogle: () => {}, signInWithCredentials: () => {}, registerWithEmail: () => {} };
  }
  
  const { sendOTP, verifyOTP, signInWithGoogle, signInWithCredentials, registerWithEmail } = authHook;

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) return;
    
    setIsLoading(true);
    try {
      const result = await sendOTP(phoneNumber);
      
      if (!result.success) {
        alert('Error sending OTP. Please try again.');
        return;
      }
      
      setStep("otp");
      setCountdown(30);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    try {
      const result = await verifyOTP(otp, phoneNumber);
      
      if (!result.success) {
        alert('Invalid OTP. Please try again.');
        return;
      }
      
      // Redirect based on user role
      await redirectUserByRole(result.user);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error verifying OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameLogin = async () => {
    if (!username || !password) return;
    
    setIsLoading(true);
    try {
      let result;
      
      if (isRegistering) {
        if (!displayName) {
          alert('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        result = await registerWithEmail(username, password, displayName);
      } else {
        result = await signInWithCredentials(username, password);
      }
      
      if (!result.success) {
        alert(result.error || 'Authentication failed. Please try again.');
        return;
      }
      
      // Redirect based on user role
      await redirectUserByRole(result.user);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error with authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        alert('Google sign-in failed. Please try again.');
        return;
      }
      
      // Redirect based on user role
      await redirectUserByRole(result.user);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error with Google sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      const result = await sendOTP(phoneNumber);
      
      if (!result.success) {
        alert('Error resending OTP. Please try again.');
        return;
      }
      
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error resending OTP. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            Please check your .env file and ensure all Firebase environment variables are set.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">UG</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to UrbanGenie</h1>
          <p className="text-white/80">Sign in to continue</p>
        </div>

        <Card className="p-6 shadow-2xl">
          {step === "otp" ? (
            <>
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to +91 {phoneNumber.replace(/[^0-9]/g, '')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90" 
                  size="lg"
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Didn't receive the code?
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleResendOTP}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Real OTP sent to your mobile number
                  </p>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setStep("phone")}
                >
                  Change Number
                </Button>
              </div>
            </>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="phone">Phone</TabsTrigger>
                <TabsTrigger value="username">Username</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
              </TabsList>
              
              <TabsContent value="phone" className="space-y-4">
                <div className="text-center mb-6">
                  <Phone className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h2 className="text-xl font-semibold mb-2">Enter Mobile Number</h2>
                  <p className="text-sm text-muted-foreground">
                    We'll send you a verification code
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex mt-1">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                        +91
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="rounded-l-none"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90" 
                    size="lg"
                    onClick={handleSendOTP}
                    disabled={phoneNumber.length !== 10 || isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="username" className="space-y-4">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h2 className="text-xl font-semibold mb-2">{isRegistering ? "Create Account" : "Sign In"}</h2>
                  <p className="text-sm text-muted-foreground">
                    {isRegistering ? "Create a new account" : "Enter your credentials"}
                  </p>
                </div>

                <div className="space-y-4">
                  {isRegistering && (
                    <div>
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Enter your full name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="username">{isRegistering ? "Email" : "Username or Email"}</Label>
                    <Input
                      id="username"
                      type={isRegistering ? "email" : "text"}
                      placeholder={isRegistering ? "Enter your email" : "Enter username or email"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90" 
                    size="lg"
                    onClick={handleUsernameLogin}
                    disabled={!username || !password || (isRegistering && !displayName) || isLoading}
                  >
                    {isLoading ? (isRegistering ? "Creating Account..." : "Signing In...") : (isRegistering ? "Create Account" : "Sign In")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary"
                      onClick={() => setIsRegistering(!isRegistering)}
                    >
                      {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <div className="text-center mb-6">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h2 className="text-xl font-semibold mb-2">Continue with Google</h2>
                  <p className="text-sm text-muted-foreground">
                    Sign in quickly with your Google account
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300" 
                    size="lg"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isLoading ? "Signing In..." : "Continue with Google"}
                  </Button>
                </div>
              </TabsContent>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </Tabs>
          )}
        </Card>
        
        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>

        <div className="text-center mt-6 text-white/60 text-sm">
          Need help? Contact support at 1800-123-4567
        </div>
      </div>
    </div>
  );
};

export default Login;