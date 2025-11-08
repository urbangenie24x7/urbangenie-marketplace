import { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import OrderAssignment from "@/modules/admin/pages/OrderAssignment";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Order {
  id: string;
  customer: string;
  phone: string;
  service: string;
  amount: number;
  status: string;
  date: string;
  time: string;
  address: string;
  assignedVendor?: string;
  vendorId?: string;
  customerId?: string;
  serviceId?: string;
  location?: { lat: number; lng: number };
}

interface ModalState<T> {
  isOpen: boolean;
  order: T | null;
}

interface AssignmentModalState {
  isOpen: boolean;
  orderId: string;
}

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignmentModal, setAssignmentModal] = useState<AssignmentModalState>({isOpen: false, orderId: ""});
  const [viewModal, setViewModal] = useState<ModalState<Order>>({isOpen: false, order: null});
  const [editModal, setEditModal] = useState<ModalState<Order>>({isOpen: false, order: null});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAssignment = (orderId: string, vendorName: string) => {
    if (!orderId || !vendorName) {
      toast.error('Invalid vendor assignment data');
      return;
    }
    
    setOrders(prevOrders => 
      prevOrders.map((order: Order) => 
        order.id === orderId 
          ? { ...order, assignedVendor: vendorName, status: "In Progress" }
          : order
      )
    );
  };

  const handleViewOrder = (order: Order) => {
    setViewModal({isOpen: true, order});
  };

  const handleEditOrder = (order: Order) => {
    setEditModal({isOpen: true, order});
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) {
      toast.error('Invalid order ID');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete order');
    }
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    if (!updatedOrder?.id) {
      toast.error('Invalid order data');
      return;
    }

    try {
      const { id, ...updateData } = updatedOrder;
      await updateDoc(doc(db, 'orders', id), updateData);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      setEditModal({isOpen: false, order: null});
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Order ID</th>
                <th className="text-left p-4 font-semibold text-gray-900">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-900">Service</th>
                <th className="text-left p-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Date & Time</th>
                <th className="text-left p-4 font-semibold text-gray-900">Assigned Vendor</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order: Order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-blue-600">{order.id}</div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-gray-600">{order.phone}</div>
                      <div className="text-sm text-gray-600">{order.address}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{order.service}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">₹{order.amount}</div>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{order.date}</div>
                      <div className="text-sm text-gray-600">{order.time}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    {order.assignedVendor ? (
                      <div>
                        <div className="font-medium text-green-600">{order.assignedVendor}</div>
                        <div className="text-sm text-gray-600">Assigned</div>
                      </div>
                    ) : (
                      <Badge variant="secondary">Unassigned</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!order.assignedVendor && order.status === "Pending" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setAssignmentModal({isOpen: true, orderId: order.id})}
                          title="Assign Vendor"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewOrder(order)}
                        title="View Order"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditOrder(order)}
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            Loading orders...
          </div>
        )}
        
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {orders.length === 0 ? 'No orders found. Seed the database to add sample data.' : 'No orders found matching your criteria'}
          </div>
        )}
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
      
      <OrderAssignment 
        orderId={assignmentModal.orderId}
        isOpen={assignmentModal.isOpen}
        onClose={() => setAssignmentModal({isOpen: false, orderId: ""})}
        onAssignmentComplete={handleVendorAssignment}
      />

      {/* View Order Dialog */}
      <Dialog open={viewModal.isOpen} onOpenChange={() => setViewModal({isOpen: false, order: null})}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {viewModal.order && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-gray-900">{viewModal.order.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge className={getStatusColor(viewModal.order.status)}>
                    {viewModal.order.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{viewModal.order.customer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{viewModal.order.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Service</label>
                  <p className="text-gray-900">{viewModal.order.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-gray-900 font-semibold">₹{viewModal.order.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{viewModal.order.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{viewModal.order.time}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900">{viewModal.order.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Assigned Vendor</label>
                <p className="text-gray-900">{viewModal.order.assignedVendor || 'Not assigned'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={editModal.isOpen} onOpenChange={() => setEditModal({isOpen: false, order: null})}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {editModal.order && (
            <EditOrderForm 
              order={editModal.order} 
              onSave={handleUpdateOrder}
              onCancel={() => setEditModal({isOpen: false, order: null})}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Edit Order Form Component
interface EditOrderFormProps {
  order: Order;
  onSave: (order: Order) => void;
  onCancel: () => void;
}

const EditOrderForm = ({ order, onSave, onCancel }: EditOrderFormProps) => {
  const [formData, setFormData] = useState({
    customer: order.customer,
    phone: order.phone,
    service: order.service,
    amount: order.amount,
    status: order.status,
    date: order.date,
    time: order.time,
    address: order.address
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customer?.trim() || !formData.phone?.trim() || !formData.service?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    
    onSave({ ...order, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Customer Name</label>
          <Input
            value={formData.customer}
            onChange={(e) => setFormData({...formData, customer: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Service</label>
          <Input
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Date</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Time</label>
          <Input
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Address</label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>
      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};

export default AdminOrders;