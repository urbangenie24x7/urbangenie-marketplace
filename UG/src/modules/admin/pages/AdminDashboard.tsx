import { useState } from "react";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Star,
  Package,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data - would come from API
  const stats = {
    totalRevenue: 125000,
    totalOrders: 1250,
    totalCustomers: 850,
    avgRating: 4.8,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2
  };

  const recentOrders = [
    { id: "UG123456", customer: "Priya Sharma", service: "Hair Cut", amount: 499, status: "Completed", time: "2 hours ago" },
    { id: "UG123455", customer: "Rahul Verma", service: "Massage", amount: 1299, status: "In Progress", time: "3 hours ago" },
    { id: "UG123454", customer: "Sneha Patel", service: "Meal Prep", amount: 799, status: "Pending", time: "5 hours ago" },
    { id: "UG123453", customer: "Amit Kumar", service: "Tailoring", amount: 599, status: "Completed", time: "1 day ago" }
  ];

  const topServices = [
    { name: "Hair Cut & Styling", orders: 320, revenue: 159800, growth: 15 },
    { name: "Full Body Massage", orders: 180, revenue: 233820, growth: 8 },
    { name: "Meal Preparation", orders: 250, revenue: 199750, growth: 22 },
    { name: "Custom Tailoring", orders: 120, revenue: 71880, growth: -5 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-100";
      case "In Progress": return "text-blue-600 bg-blue-100";
      case "Pending": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">UrbanGenie Business Overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
              7 Days
            </Button>
            <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
              30 Days
            </Button>
            <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
              90 Days
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.revenueGrowth}% from last period</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.orderGrowth}% from last period</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.customerGrowth}% from last period</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
                <p className="text-sm text-gray-600">Based on 1,250+ reviews</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer} • {order.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.amount}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-gray-500">{order.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Services */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Services</h3>
                <div className="space-y-4">
                  {topServices.map((service, index) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{service.revenue.toLocaleString()}</p>
                        <p className={`text-sm ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {service.growth >= 0 ? '+' : ''}{service.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Management</h3>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">₹{order.amount}</p>
                        <p className="text-sm text-gray-600">{order.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Service Management</h3>
                <Button>Add New Service</Button>
              </div>
              <div className="space-y-4">
                {topServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.orders} total orders</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">₹{service.revenue.toLocaleString()}</p>
                        <p className={`text-sm ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {service.growth >= 0 ? '+' : ''}{service.growth}% growth
                        </p>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalCustomers}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">68%</div>
                  <div className="text-sm text-gray-600">Repeat Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹147</div>
                  <div className="text-sm text-gray-600">Avg Order Value</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;