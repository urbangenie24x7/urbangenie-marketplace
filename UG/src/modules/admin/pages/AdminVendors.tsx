import { useState, useEffect } from "react";
import { Search, MapPin, Star, Phone, Mail, Plus, Eye, Edit, CheckCircle, XCircle } from "lucide-react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

interface Vendor {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  experience_years: number;
  description: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  business_type: 'individual' | 'shop' | 'company';
  gstin: string;
  fssai_license: string;
  pan_number: string;
  bank_account_number: string;
  bank_ifsc: string;
  bank_account_holder_name: string;
  upi_id: string;
  skills: { service_id: string; service_name: string; }[];
}

const AdminVendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingVendor, setReviewingVendor] = useState<Vendor | null>(null);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    experience_years: 0,
    category: '',
    subcategory: '',
    skills: ''
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subcategories'));
      const subcategoriesData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(sub => sub.category === categoryId);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vendors'));
      const vendorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        verification_status: doc.data().status || 'pending',
        created_at: doc.data().joinDate || new Date().toISOString(),
        business_type: 'individual',
        skills: doc.data().skills?.map(skill => ({ service_name: skill })) || []
      }));
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (vendorId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'vendors', vendorId), {
        status: status,
        verification_status: status,
        updatedAt: new Date().toISOString()
      });

      if (status === 'approved') {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
          const credentials = {
            phone: vendor.phone,
            password: vendor.phone.slice(-4),
            loginUrl: `${window.location.origin}/vendor/login`
          };
          toast.success(`Vendor approved! Credentials: Phone: ${credentials.phone}, Password: ${credentials.password}`);
        }
      } else {
        toast.success(`Vendor ${status} successfully`);
      }
      
      setVendors(prev => prev.map(v => 
        v.id === vendorId ? { ...v, verification_status: status } : v
      ));
      setReviewingVendor(null);
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast.error('Failed to update vendor status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Manage service providers and their assignments</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:opacity-90"
          onClick={() => setAddVendorOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{vendors.length}</div>
          <div className="text-sm text-gray-600">Total Vendors</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{vendors.filter(v => v.verification_status === 'approved').length}</div>
          <div className="text-sm text-gray-600">Approved Vendors</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{vendors.filter(v => v.verification_status === 'pending').length}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">{vendors.filter(v => v.verification_status === 'rejected').length}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search vendors by name or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                  {vendor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{vendor.name}</h3>
                  <p className="text-gray-600">{vendor.experience_years} years experience</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(vendor.verification_status)}>
                      {vendor.verification_status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setReviewingVendor(vendor)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {vendor.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {vendor.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {vendor.address}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Applied: {new Date(vendor.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {vendor.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill.service_name}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            {vendors.length === 0 ? 'No vendors found. Seed the database to add sample data.' : 'No vendors found matching your criteria'}
          </p>
        </Card>
      )}

      {/* Add Vendor Dialog */}
      <Dialog open={addVendorOpen} onOpenChange={setAddVendorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                placeholder="Vendor name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={newVendor.phone}
                onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={newVendor.email}
                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={newVendor.address}
                onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                placeholder="Address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Experience (years)</label>
              <Input
                type="number"
                value={newVendor.experience_years}
                onChange={(e) => setNewVendor({...newVendor, experience_years: parseInt(e.target.value) || 0})}
                placeholder="Years of experience"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={newVendor.category} 
                onValueChange={(value) => {
                  setNewVendor({...newVendor, category: value, subcategory: ''});
                  fetchSubcategories(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Subcategory</label>
              <Select 
                value={newVendor.subcategory} 
                onValueChange={(value) => setNewVendor({...newVendor, subcategory: value})}
                disabled={!newVendor.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Additional Skills (comma separated)</label>
              <Input
                value={newVendor.skills}
                onChange={(e) => setNewVendor({...newVendor, skills: e.target.value})}
                placeholder="Additional skills or specializations"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={async () => {
                  try {
                    const vendorData = {
                      ...newVendor,
                      status: 'pending',
                      verification_status: 'pending',
                      created_at: new Date().toISOString(),
                      joinDate: new Date().toISOString(),
                      skills: newVendor.skills.split(',').map(s => s.trim()).filter(s => s),
                      latitude: 0,
                      longitude: 0,
                      description: '',
                      business_type: 'individual',
                      gstin: '',
                      fssai_license: '',
                      pan_number: '',
                      bank_account_number: '',
                      bank_ifsc: '',
                      bank_account_holder_name: '',
                      upi_id: ''
                    };
                    
                    await setDoc(doc(db, 'vendors', Date.now().toString()), vendorData);
                    toast.success('Vendor added successfully');
                    setAddVendorOpen(false);
                    setNewVendor({ name: '', phone: '', email: '', address: '', experience_years: 0, category: '', subcategory: '', skills: '' });
                    setSubcategories([]);
                    fetchVendors();
                  } catch (error) {
                    console.error('Error adding vendor:', error);
                    toast.error('Failed to add vendor');
                  }
                }}
                className="flex-1"
              >
                Add Vendor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setAddVendorOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={!!reviewingVendor} onOpenChange={() => setReviewingVendor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Application Review</DialogTitle>
          </DialogHeader>
          {reviewingVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{reviewingVendor.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{reviewingVendor.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{reviewingVendor.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Experience</label>
                  <p className="text-gray-900">{reviewingVendor.experience_years} years</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900">{reviewingVendor.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {reviewingVendor.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.service_name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Badge className={getStatusColor(reviewingVendor.verification_status)}>
                  {reviewingVendor.verification_status}
                </Badge>
              </div>
              
              {reviewingVendor.verification_status === 'pending' && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleStatusUpdate(reviewingVendor.id, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Vendor
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(reviewingVendor.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVendors;