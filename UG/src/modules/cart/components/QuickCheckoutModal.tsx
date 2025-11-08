import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickCheckoutModal = ({ isOpen, onClose }: QuickCheckoutModalProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProceed = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter both name and phone number");
      return;
    }

    if (phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    
    // Store basic info for checkout with sanitization
    const sanitizedName = name.trim().replace(/[<>"'&]/g, (match) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });
    
    const sanitizedPhone = phone.trim().replace(/[^0-9]/g, '');
    
    localStorage.setItem('quick_customer_info', JSON.stringify({
      name: sanitizedName,
      phone: sanitizedPhone
    }));

    setTimeout(() => {
      onClose();
      navigate('/checkout');
    }, 500);
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Details</DialogTitle>
          <p className="text-sm text-muted-foreground">
            We need your name & phone to place the order
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="quick-name">Full Name</Label>
            <Input
              id="quick-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="quick-phone">Phone Number</Label>
            <div className="flex">
              <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                +91
              </div>
              <Input
                id="quick-phone"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="rounded-l-none"
                maxLength={10}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProceed}
            disabled={loading}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCheckoutModal;