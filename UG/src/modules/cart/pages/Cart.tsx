import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/modules/cart/context/CartContext";
import QuickCheckoutModal from "@/modules/cart/components/QuickCheckoutModal";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateQuantity, removeFromCart, subtotal } = useCart();
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);
  
  const serviceFee = 49;
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Loading cart...</p>
          </Card>
        ) : cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button className="bg-gradient-primary hover:opacity-90">
              Browse Services
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.duration}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-lg font-semibold">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-medium">₹{serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charges</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">₹{total}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <Input placeholder="Enter promo code" />
                  <Button variant="outline" className="w-full">
                    Apply Code
                  </Button>
                </div>

                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90" 
                  size="lg"
                  onClick={() => setShowQuickCheckout(true)}
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <p>• 100% Secure Payment</p>
                  <p>• Easy Cancellation</p>
                  <p>• 24/7 Customer Support</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <QuickCheckoutModal 
        isOpen={showQuickCheckout}
        onClose={() => setShowQuickCheckout(false)}
      />
    </div>
  );
};

export default Cart;
