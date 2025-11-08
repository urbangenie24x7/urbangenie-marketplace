import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Shield, Lock } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('checkout_data');
    if (data) {
      setCheckoutData(JSON.parse(data));
      setPaymentMethod(JSON.parse(data).paymentMethod);
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const orderTotal = checkoutData?.total || 0;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Secure Payment Gateway</span>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking">Net Banking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet">Digital Wallet</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="Name on card" />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Google Pay</Button>
                    <Button variant="outline" size="sm">PhonePe</Button>
                    <Button variant="outline" size="sm">Paytm</Button>
                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-4">
                  <Label>Select Your Bank</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">SBI</Button>
                    <Button variant="outline" size="sm">HDFC</Button>
                    <Button variant="outline" size="sm">ICICI</Button>
                    <Button variant="outline" size="sm">Axis Bank</Button>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="space-y-4">
                  <Label>Select Wallet</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Paytm Wallet</Button>
                    <Button variant="outline" size="sm">Amazon Pay</Button>
                    <Button variant="outline" size="sm">Mobikwik</Button>
                    <Button variant="outline" size="sm">Freecharge</Button>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Order Total</span>
                  <span>₹{orderTotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied</span>
                  <span>-₹0</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Amount to Pay</span>
                <span className="text-primary">₹{orderTotal}</span>
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90" 
                size="lg"
                onClick={() => {
                  setLoading(true);
                  // Simulate payment processing
                  setTimeout(() => {
                    localStorage.removeItem('checkout_data');
                    navigate('/order-confirmation');
                  }, 2000);
                }}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ₹${orderTotal}`}
              </Button>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <p>• 100% Secure Payment</p>
                <p>• SSL Encrypted</p>
                <p>• PCI DSS Compliant</p>
                <p>• Instant Confirmation</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;