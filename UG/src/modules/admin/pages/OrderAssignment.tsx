import { useState } from "react";
import { MapPin, Star, Phone, Clock, CheckCircle, X, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OrderAssignmentProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onAssignmentComplete: (orderId: string, vendorName: string) => void;
}

const OrderAssignment = ({ orderId, isOpen, onClose, onAssignmentComplete }: OrderAssignmentProps) => {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  // Test different services by changing the service name below:
  const testServices = [
    { name: "AC Gas Filling", category: "Home Services", amount: 799 },
    { name: "Premium Hair Cut & Styling", category: "Beauty & Salon", amount: 499 },
    { name: "House Cleaning", category: "Home Services", amount: 899 },
    { name: "Electrical Repair", category: "Home Services", amount: 599 },
    { name: "Computer Repair", category: "Electronics", amount: 699 }
  ];
  
  const currentService = testServices[0]; // Change index: 0=AC, 1=Hair, 2=Cleaning, 3=Electrical, 4=Computer
  
  const order = {
    id: orderId,
    customer: "Priya Sharma",
    service: currentService.name,
    category: currentService.category,
    address: "123 Main Street, Banjara Hills, Hyderabad - 500034",
    scheduledDate: "2024-01-16",
    scheduledTime: "10:00 AM",
    amount: currentService.amount,
    customerLat: 17.4065,
    customerLng: 78.4691
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate match score based on skills, distance, rating, and availability
  const calculateMatchScore = (vendor: any, requiredSkills: string[]) => {
    let score = 0;
    
    // Skill matching (40% weight)
    const skillMatches = vendor.skills.filter((skill: string) => 
      requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
    ).length;
    const skillScore = (skillMatches / requiredSkills.length) * 40;
    score += skillScore;
    
    // Distance factor (25% weight) - closer is better
    const distanceScore = Math.max(0, 25 - (vendor.distance * 2));
    score += distanceScore;
    
    // Rating factor (20% weight)
    const ratingScore = (vendor.rating / 5) * 20;
    score += ratingScore;
    
    // Verification status (10% weight)
    const verificationScore = vendor.isVerified ? 10 : 5;
    score += verificationScore;
    
    // Availability factor (5% weight)
    const availabilityScore = vendor.availability === "Available" ? 5 : 2;
    score += availabilityScore;
    
    return Math.min(100, Math.round(score));
  };

  // Mock vendor data with expanded profiles (including mobile/traveling vendors)
  const allVendors = [
    {
      id: "1",
      name: "Rajesh Kumar",
      businessName: "Rajesh Hair Studio",
      phone: "+91 9876543210",
      rating: 4.8,
      totalReviews: 156,
      totalOrders: 320,
      latitude: 17.4065,
      longitude: 78.4691,
      skills: ["Hair Cutting", "Hair Styling", "Hair Coloring"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "17",
      name: "Hair Studio Express",
      businessName: "Hair Studio Express",
      phone: "+91 9876543226",
      rating: 4.5,
      totalReviews: 89,
      totalOrders: 165,
      latitude: 17.4483,
      longitude: 78.3915,
      skills: ["Hair Cutting", "Hair Styling", "Beard Trimming"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "18",
      name: "Style Zone Salon",
      businessName: "Style Zone Salon",
      phone: "+91 9876543227",
      rating: 4.6,
      totalReviews: 112,
      totalOrders: 198,
      latitude: 17.4850,
      longitude: 78.4867,
      skills: ["Hair Cutting", "Hair Styling", "Hair Coloring", "Hair Treatment"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "9",
      name: "Beauty Expert Kavya",
      businessName: "Kavya Beauty Parlour",
      phone: "+91 9876543218",
      rating: 4.8,
      totalReviews: 134,
      totalOrders: 245,
      latitude: 17.4374,
      longitude: 78.4482,
      skills: ["Makeup", "Facial", "Eyebrow Threading", "Hair Styling"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "13",
      name: "Cool Air AC Services",
      businessName: "Cool Air AC Services",
      phone: "+91 9876543222",
      rating: 4.7,
      totalReviews: 178,
      totalOrders: 290,
      latitude: 17.4065,
      longitude: 78.4691,
      skills: ["AC Gas Filling", "AC Repair", "AC Installation"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "14",
      name: "Chill Zone AC Care",
      businessName: "Chill Zone AC Care",
      phone: "+91 9876543223",
      rating: 4.5,
      totalReviews: 145,
      totalOrders: 220,
      latitude: 17.4239,
      longitude: 78.4738,
      skills: ["AC Gas Filling", "AC Maintenance", "AC Cleaning"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "15",
      name: "Frost Free AC Solutions",
      businessName: "Frost Free AC Solutions Pvt Ltd",
      phone: "+91 9876543224",
      rating: 4.8,
      totalReviews: 203,
      totalOrders: 380,
      latitude: 17.4647,
      longitude: 78.3498,
      skills: ["AC Gas Filling", "AC Repair", "AC Service"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "16",
      name: "Arctic AC Experts",
      businessName: "Arctic AC Experts Pvt Ltd",
      phone: "+91 9876543225",
      rating: 4.9,
      totalReviews: 267,
      totalOrders: 450,
      latitude: 17.4400,
      longitude: 78.3489,
      skills: ["AC Gas Filling", "AC Repair", "AC Installation", "AC Duct Cleaning"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "10",
      name: "AC Service Center",
      businessName: "AC Service Center Pvt Ltd",
      phone: "+91 9876543219",
      rating: 4.3,
      totalReviews: 189,
      totalOrders: 410,
      latitude: 17.3616,
      longitude: 78.5522,
      skills: ["AC Repair", "AC Installation", "AC Maintenance", "AC Gas Filling"],
      availability: "Busy until 3 PM",
      isVerified: true
    },
    {
      id: "5",
      name: "Clean Pro Services",
      businessName: "Clean Pro Services Pvt Ltd",
      phone: "+91 9876543214",
      rating: 4.6,
      totalReviews: 145,
      totalOrders: 290,
      latitude: 17.4400,
      longitude: 78.3489,
      skills: ["House Cleaning", "Deep Cleaning", "Office Cleaning"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "19",
      name: "SparkClean Services",
      businessName: "SparkClean Services Pvt Ltd",
      phone: "+91 9876543228",
      rating: 4.4,
      totalReviews: 98,
      totalOrders: 175,
      latitude: 17.4399,
      longitude: 78.4983,
      skills: ["House Cleaning", "Deep Cleaning", "Carpet Cleaning"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "20",
      name: "Elite Cleaning Co",
      businessName: "Elite Cleaning Co Pvt Ltd",
      phone: "+91 9876543229",
      rating: 4.7,
      totalReviews: 156,
      totalOrders: 280,
      latitude: 17.4374,
      longitude: 78.4482,
      skills: ["House Cleaning", "Deep Cleaning", "Office Cleaning", "Window Cleaning"],
      availability: "Available",
      isVerified: true
    },
    {
      id: "2",
      name: "Priya Wellness",
      businessName: "Priya Spa Services",
      phone: "+91 9876543211",
      rating: 4.9,
      totalReviews: 89,
      totalOrders: 180,
      latitude: 17.4239, // Current location (updates dynamically)
      longitude: 78.4738,
      skills: ["Full Body Massage", "Aromatherapy", "Reflexology"],
      availability: "Busy until 2 PM",
      isVerified: true,
      businessType: "individual",
      isMobile: true, // Travels to customer locations
      travelRadius: 10, // Willing to travel up to 10km
      currentlyAt: "Jubilee Hills", // Current area
      lastLocationUpdate: "2024-01-16T14:30:00Z"
    },
    {
      id: "4",
      name: "Suresh Electrician",
      businessName: "Suresh Electric Works",
      phone: "+91 9876543213",
      rating: 4.7,
      totalReviews: 203,
      totalOrders: 380,
      latitude: 17.4483, // Current location (mobile)
      longitude: 78.3915,
      skills: ["Electrical Repairs", "Wiring Installation", "Appliance Repair"],
      availability: "Available",
      isVerified: true,
      businessType: "individual",
      isMobile: true, // Freelancer who travels
      travelRadius: 15, // Willing to travel up to 15km
      currentlyAt: "Madhapur", // Currently in this area
      lastLocationUpdate: "2024-01-16T13:45:00Z",
      vehicleType: "Bike" // Transportation method
    },
    {
      id: "8",
      name: "Tech Support Pro",
      businessName: "Tech Support Pro",
      phone: "+91 9876543217",
      rating: 4.4,
      totalReviews: 267,
      totalOrders: 520,
      latitude: 17.4435, // Current location
      longitude: 78.3772,
      skills: ["Computer Repair", "Mobile Repair", "Software Installation"],
      availability: "Available",
      isVerified: true,
      businessType: "individual",
      isMobile: true, // Mobile tech support
      travelRadius: 12, // Service radius
      currentlyAt: "Hitech City",
      lastLocationUpdate: "2024-01-16T15:00:00Z",
      vehicleType: "Car"
    },
    {
      id: "21",
      name: "Mobile Mechanic Ravi",
      businessName: "On-Wheels Auto Service",
      phone: "+91 9876543230",
      rating: 4.6,
      totalReviews: 145,
      totalOrders: 280,
      latitude: 17.4200, // Currently moving
      longitude: 78.4500,
      skills: ["Car Repair", "Bike Service", "Battery Replacement"],
      availability: "Available",
      isVerified: true,
      businessType: "individual",
      isMobile: true,
      travelRadius: 20, // Wide service area
      currentlyAt: "En route to Banjara Hills",
      lastLocationUpdate: "2024-01-16T15:15:00Z",
      vehicleType: "Service Van",
      isCurrentlyTraveling: true
    }
  ];

  // Determine required skills based on service
  const getRequiredSkills = (serviceName: string) => {
    const skillMap: { [key: string]: string[] } = {
      "Premium Hair Cut & Styling": ["Hair Cutting", "Hair Styling"],
      "AC Gas Filling": ["AC Gas Filling", "AC Repair"],
      "AC Repair Service": ["AC Repair", "AC Maintenance"],
      "House Cleaning": ["House Cleaning", "Deep Cleaning"],
      "Electrical Repair": ["Electrical Repairs", "Wiring Installation"],
      "Computer Repair": ["Computer Repair", "Software Installation"],
      "Full Body Massage": ["Full Body Massage", "Aromatherapy"]
    };
    return skillMap[serviceName] || ["General Service"];
  };

  const requiredSkills = getRequiredSkills(order.service);

  // Filter and score vendors based on location and skills (including mobile vendors)
  const nearbyVendors = allVendors
    .map(vendor => {
      const distance = calculateDistance(
        order.customerLat,
        order.customerLng,
        vendor.latitude,
        vendor.longitude
      );
      
      // For mobile vendors, check if customer is within their travel radius
      const canReachCustomer = vendor.isMobile ? 
        distance <= (vendor.travelRadius || 10) : 
        distance <= 15;
      
      const matchScore = calculateMatchScore(vendor, requiredSkills);
      
      // Adjust estimated time based on vendor type and travel method
      let estimatedTime;
      if (vendor.isMobile) {
        const travelTime = vendor.vehicleType === "Car" || vendor.vehicleType === "Service Van" ? 
          Math.ceil(distance * 3) : // 3 mins per km for car/van
          Math.ceil(distance * 4); // 4 mins per km for bike
        
        if (vendor.isCurrentlyTraveling) {
          estimatedTime = `${travelTime + 10}-${travelTime + 20} mins (currently traveling)`;
        } else {
          estimatedTime = `${travelTime}-${travelTime + 10} mins`;
        }
      } else {
        estimatedTime = distance < 2 ? "20-30 mins" : 
                       distance < 5 ? "30-45 mins" : 
                       distance < 10 ? "45-60 mins" : "60+ mins";
      }
      
      return {
        ...vendor,
        distance: Math.round(distance * 10) / 10,
        matchScore,
        estimatedTime,
        canReachCustomer
      };
    })
    .filter(vendor => {
      // Include vendors who can reach the customer and have skill match
      const hasSkillMatch = vendor.skills.some(skill => 
        requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
      );
      return vendor.canReachCustomer && (hasSkillMatch || vendor.matchScore > 30);
    })
    .sort((a, b) => {
      // Prioritize mobile vendors who are closer or currently traveling
      if (a.isMobile && !b.isMobile) return -1;
      if (!a.isMobile && b.isMobile) return 1;
      return b.matchScore - a.matchScore;
    })
    .slice(0, 6); // Show top 6 matches

  const handleAssignOrder = async () => {
    if (!selectedVendor) return;
    
    setAssigning(true);
    
    // Find selected vendor details
    const vendor = nearbyVendors.find(v => v.id === selectedVendor);
    
    // Simulate API call
    setTimeout(() => {
      if (vendor) {
        onAssignmentComplete(orderId, vendor.name);
      }
      setAssigning(false);
      setSelectedVendor(null);
      onClose();
    }, 1500);
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability === "Available") return "bg-green-100 text-green-700";
    if (availability.includes("Busy")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Order to Vendor</DialogTitle>
        </DialogHeader>

        {/* Order Details */}
        <Card className="p-4 mb-6 bg-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Order Details</h4>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Customer:</strong> {order.customer}</p>
              <p><strong>Service:</strong> {order.service}</p>
              <p><strong>Category:</strong> {order.category}</p>
              <p><strong>Amount:</strong> ₹{order.amount}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Schedule & Location</h4>
              <p><strong>Date:</strong> {order.scheduledDate}</p>
              <p><strong>Time:</strong> {order.scheduledTime}</p>
              <div className="flex items-start gap-2 mt-2">
                <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                <span className="text-sm">{order.address}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Available Vendors */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Available Vendors ({nearbyVendors.length} found)
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Service: <strong>{order.service}</strong> | Required skills: <strong>{requiredSkills.join(", ")}</strong>
            </p>
            <p className="text-xs text-blue-600">
              💡 Mobile vendors travel to your location | Fixed vendors require visit to their shop
            </p>
          </div>
          
          <div className="space-y-4">
            {nearbyVendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className={`p-4 cursor-pointer transition-all ${
                  selectedVendor === vendor.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedVendor(vendor.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {vendor.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{vendor.name}</h4>
                        {vendor.isVerified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{vendor.businessName}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{vendor.rating}</span>
                          <span>({vendor.totalReviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{vendor.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{vendor.distance} km away</span>
                          {vendor.isMobile && (
                            <Badge variant="outline" className="text-xs ml-2">
                              Mobile Service
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {vendor.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      {vendor.isMobile && (
                        <div className="text-xs text-blue-600 mb-1">
                          📍 Currently at: {vendor.currentlyAt} | 
                          🚗 {vendor.vehicleType} | 
                          📏 Travels up to {vendor.travelRadius}km
                          {vendor.isCurrentlyTraveling && " | 🚀 Currently traveling"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-bold mb-1 ${getMatchScoreColor(vendor.matchScore)}`}>
                      {vendor.matchScore}% Match
                    </div>
                    <Badge className={getAvailabilityColor(vendor.availability)}>
                      {vendor.availability}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {vendor.estimatedTime}
                    </div>
                  </div>
                </div>

                {selectedVendor === vendor.id && (
                  <div className="mt-4 pt-4 border-t bg-white rounded p-3">
                    <div className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Selected for assignment</span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Assignment Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignOrder}
            disabled={!selectedVendor || assigning}
            className="bg-gradient-primary hover:opacity-90"
          >
            {assigning ? "Assigning..." : "Assign Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderAssignment;