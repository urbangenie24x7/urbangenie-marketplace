import { useState, useEffect } from "react";
import { User, MapPin, Phone, Mail, Calendar, Star, Package, CreditCard, Settings, LogOut } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const CustomerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };
  const [customerData, setCustomerData] = useState({
    name: "Guest User",
    email: "guest@example.com",
    phone: "+91 00000 00000",
    address: "No address provided",
    joinDate: "Recently",
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0
  });

  useEffect(() => {
    if (user) {
      setCustomerData({
        name: user.displayName || user.email?.split('@')[0] || "User",
        email: user.email || "No email provided",
        phone: user.phoneNumber || "+91 00000 00000",
        address: "No address provided",
        joinDate: new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  const recentOrders = [
    {
      id: "UG123456",
      date: "2024-01-15",
      service: "Premium Hair Cut & Styling",
      amount: 499,
      status: "Completed",
      rating: 5
    },
    {
      id: "UG123455",
      date: "2024-01-10",
      service: "Full Body Massage",
      amount: 1299,
      status: "Completed",
      rating: 4
    },
    {
      id: "UG123454",
      date: "2024-01-05",
      service: "Gourmet Meal Prep",
      amount: 799,
      status: "Completed",
      rating: 5
    }
  ];

  const savedAddresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Banjara Hills, Hyderabad - 500034",
      isDefault: true
    },
    {
      id: 2,
      type: "Office",
      address: "456 Tech Park, HITEC City, Hyderabad - 500081",
      isDefault: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{customerData.name}</h1>
                <p className="text-muted-foreground">Customer since {customerData.joinDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{customerData.totalOrders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </Card>
            <Card className="p-6 text-center">
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">₹{customerData.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </Card>
            <Card className="p-6 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{customerData.loyaltyPoints}</div>
              <div className="text-sm text-muted-foreground">Loyalty Points</div>
            </Card>
            <Card className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm text-muted-foreground">Avg Rating Given</div>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={customerData.phone}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Primary Address</Label>
                    <Input
                      id="address"
                      value={customerData.address}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.service}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(order.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.amount}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button variant="outline">View All Orders</Button>
                </div>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <Button>Add New Address</Button>
                </div>
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold">{address.type}</p>
                              {address.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground">{address.address}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotional Offers</p>
                        <p className="text-sm text-muted-foreground">Receive offers and discounts</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Service Reminders</p>
                        <p className="text-sm text-muted-foreground">Reminders for upcoming services</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Account Actions</h2>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Update Phone Number
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      <User className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;