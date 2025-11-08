import { CheckCircle, Calendar, MapPin, Phone, Download } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const OrderConfirmation = () => {
  const orderDetails = {
    orderId: "UG" + Date.now().toString().slice(-6),
    date: "2024-01-15",
    time: "10:00 AM",
    services: [
      { title: "Premium Hair Cut & Styling", price: 499, duration: "45 mins" },
      { title: "Full Body Massage", price: 1299, duration: "60 mins" },
    ],
    customer: {
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "123 Main Street, Banjara Hills, Hyderabad - 500034"
    },
    payment: {
      method: "Credit Card",
      amount: 1847,
      transactionId: "TXN" + Date.now().toString().slice(-8)
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Your booking has been confirmed. We'll see you soon!
            </p>
          </div>

          {/* Order Details */}
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Order #{orderDetails.orderId}</h2>
                <p className="text-muted-foreground">Booking confirmed</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>

            {/* Service Details */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Service Schedule
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{orderDetails.date} at {orderDetails.time}</p>
                <p className="text-sm text-muted-foreground">
                  Total Duration: {orderDetails.services.reduce((total, service) => 
                    total + parseInt(service.duration), 0)} mins
                </p>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold">Services Booked</h3>
              {orderDetails.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                  <span className="font-medium">₹{service.price}</span>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Customer Details */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Service Address
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{orderDetails.customer.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  {orderDetails.customer.phone}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {orderDetails.customer.address}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Details</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Payment Method</span>
                  <span className="font-medium">{orderDetails.payment.method}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Transaction ID</span>
                  <span className="font-medium text-sm">{orderDetails.payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-bold text-primary">₹{orderDetails.payment.amount}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p>Our professional will arrive at your location 15 minutes before the scheduled time</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p>You'll receive a call from the professional 30 minutes before arrival</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p>Enjoy your premium service experience at home</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1 bg-gradient-primary hover:opacity-90">
              Track Order
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Support
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Need help? Call us at <span className="font-medium">1800-123-4567</span> or 
              email <span className="font-medium">support@urbangenie.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;