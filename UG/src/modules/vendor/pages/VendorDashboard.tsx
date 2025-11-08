import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  DollarSign,
  LogOut
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  phone: string;
  service: string;
  amount: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  time: string;
  address: string;
  customerLat: number;
  customerLng: number;
}

const VendorDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  // Mock vendor data
  const vendor = {
    name: "Rajesh Kumar",
    businessName: "Rajesh Hair Studio",
    phone: "+91 9876543210",
    rating: 4.8,
    totalReviews: 156,
    totalOrders: 320,
    completedOrders: 298,
    earnings: 45600,
    skills: ["Hair Cutting", "Hair Styling", "Hair Coloring"]
  };

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "UG123456",
      customer: "Priya Sharma",
      phone: "+91 98765 43210",
      service: "Premium Hair Cut & Styling",
      amount: 499,
      status: "pending",
      date: "2024-01-16",
      time: "10:00 AM",
      address: "123 Main Street, Banjara Hills, Hyderabad - 500034",
      customerLat: 17.4065,
      customerLng: 78.4691
    },
    {
      id: "UG123457",
      customer: "Rahul Verma",
      phone: "+91 98765 43211",
      service: "Hair Coloring",
      amount: 899,
      status: "accepted",
      date: "2024-01-16",
      time: "2:00 PM",
      address: "456 Park Road, Jubilee Hills, Hyderabad - 500033",
      customerLat: 17.4239,
      customerLng: 78.4738
    },
    {
      id: "UG123458",
      customer: "Sneha Patel",
      phone: "+91 98765 43212",
      service: "Hair Styling",
      amount: 399,
      status: "in_progress",
      date: "2024-01-15",
      time: "11:00 AM",
      address: "789 Garden Street, Kondapur, Hyderabad - 500084",
      customerLat: 17.4647,
      customerLng: 78.3498
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject' | 'complete') => {
    try {
      console.log(`Mock order ${action}:`, orderId);
      
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          let newStatus: Order['status'];
          switch (action) {
            case 'accept':
              newStatus = 'accepted';
              break;
            case 'reject':
              newStatus = 'cancelled';
              break;
            case 'complete':
              newStatus = 'completed';
              break;
            default:
              newStatus = order.status;
          }
          return { ...order, status: newStatus };
        }
        return order;
      }));

      toast.success(`Order ${action}ed successfully`);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {vendor.name}!</p>
        </div>
        <Button 
          variant="outline"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{vendor.totalOrders}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{vendor.completedOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-yellow-600">{vendor.rating}</p>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{vendor.earnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Orders */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.service}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{order.customer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{order.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{order.date} at {order.time}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1" />
                          <span>{order.address}</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          ₹{order.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </Button>
                    
                    {order.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleOrderAction(order.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleOrderAction(order.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'accepted' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleOrderAction(order.id, 'complete')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No orders available at the moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{selectedOrder.customer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedOrder.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Service</label>
                  <p className="text-gray-900">{selectedOrder.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-gray-900 font-bold">₹{selectedOrder.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{selectedOrder.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{selectedOrder.time}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900">{selectedOrder.address}</p>
              </div>
              
              <div className="flex gap-4 pt-4">
                {selectedOrder.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleOrderAction(selectedOrder.id, 'accept')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Accept Order
                    </Button>
                    <Button 
                      onClick={() => handleOrderAction(selectedOrder.id, 'reject')}
                      variant="destructive"
                      className="flex-1"
                    >
                      Reject Order
                    </Button>
                  </>
                )}
                
                {selectedOrder.status === 'accepted' && (
                  <Button 
                    onClick={() => handleOrderAction(selectedOrder.id, 'complete')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorDashboard;