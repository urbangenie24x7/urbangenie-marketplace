import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, DollarSign } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

interface Service {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  discount_percentage?: number;
  discounted_price?: number;
  vendor_id?: string;
  service_type?: 'platform' | 'vendor_service' | 'vendor_product';
  stock_quantity?: number;
  product_sku?: string;
  vendor_name?: string;
  vendor_price?: number;
  platform_margin_percentage?: number;
  platform_fee?: number;
  requires_delivery?: boolean;
  free_delivery_radius_km?: number;
  delivery_rate_per_km?: number;
  max_delivery_radius_km?: number;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    subcategory: '',
    description: '',
    price: 0,
    duration: '',
    image_url: '',
    discount_percentage: 0,
    is_active: true,
    service_type: 'platform' as 'platform' | 'vendor_service' | 'vendor_product',
    stock_quantity: 0,
    product_sku: '',
    vendor_price: 0,
    platform_margin_percentage: 20,
    requires_delivery: false,
    free_delivery_radius_km: 5,
    delivery_rate_per_km: 10,
    max_delivery_radius_km: 25
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().name || doc.data().title,
        category: doc.data().category,
        subcategory: doc.data().subcategory,
        description: doc.data().description,
        price: doc.data().basePrice || doc.data().price,
        duration: doc.data().duration ? `${doc.data().duration} mins` : '60 mins',
        image_url: doc.data().image_url || '',
        rating: 4.5,
        total_reviews: 100,
        service_type: 'platform' as const,
        is_active: doc.data().isActive !== false,
        discount_percentage: 0,
        ...doc.data()
      }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

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
      setCategories([]);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subcategories'));
      const subcategoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        categories: doc.data().categories || (doc.data().category ? [doc.data().category] : [])
      }));
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(sub => 
      sub.categories && sub.categories.includes(categoryId)
    );
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    return subcategory ? subcategory.name : subcategoryId;
  };

  const getSubcategoryCategories = (subcategoryId: string) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory || !subcategory.categories) return [];
    return subcategory.categories.map(catId => getCategoryName(catId)).join(', ');
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setFormData(prev => ({ ...prev, subcategory: subcategoryId }));
  };

  const getSelectedSubcategoryCategories = () => {
    if (!formData.subcategory) return [];
    const subcategory = subcategories.find(sub => sub.id === formData.subcategory);
    return subcategory?.categories || [];
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Service title is required');
      return;
    }
    if (!formData.subcategory.trim()) {
      toast.error('Subcategory is required');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    try {
      // Get primary category from subcategory's categories
      const selectedCategories = getSelectedSubcategoryCategories();
      const primaryCategory = selectedCategories.length > 0 ? selectedCategories[0] : '';
      
      const serviceData = {
        name: formData.title,
        title: formData.title,
        category: primaryCategory,
        subcategory: formData.subcategory,
        description: formData.description,
        basePrice: formData.price,
        price: formData.price,
        duration: parseInt(String(formData.duration).replace(/\D/g, '')) || 60,
        isActive: formData.is_active,
        updatedAt: new Date().toISOString()
      };

      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), serviceData);
      } else {
        await addDoc(collection(db, 'services'), {
          ...serviceData,
          createdAt: new Date().toISOString()
        });
      }

      toast.success(editingService ? 'Service updated successfully' : 'Service added successfully');
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      subcategory: service.subcategory,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image_url: service.image_url,
      discount_percentage: service.discount_percentage || 0,
      is_active: service.is_active,
      service_type: service.service_type || 'platform',
      stock_quantity: service.stock_quantity || 0,
      product_sku: service.product_sku || '',
      vendor_price: service.vendor_price || 0,
      platform_margin_percentage: service.platform_margin_percentage || 20,
      requires_delivery: service.requires_delivery || false,
      free_delivery_radius_km: service.free_delivery_radius_km || 5,
      delivery_rate_per_km: service.delivery_rate_per_km || 10,
      max_delivery_radius_km: service.max_delivery_radius_km || 25
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'services', id), {
        isActive: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error('Failed to update service status');
    }
  };

  const addMissingServices = async () => {
    try {
      // Get existing service subcategories
      const existingSubcategories = new Set(services.map(s => s.subcategory));
      
      // Find subcategories without services
      const missingSubcategories = subcategories.filter(sub => 
        !existingSubcategories.has(sub.id)
      );
      
      if (missingSubcategories.length === 0) {
        toast.info('All subcategories already have services');
        return;
      }
      
      // Create services for missing subcategories
      const servicesToAdd = missingSubcategories.map(sub => {
        const categoryId = sub.categories && sub.categories.length > 0 ? sub.categories[0] : '';
        return {
          name: `${sub.name} Service`,
          title: `${sub.name} Service`,
          category: categoryId,
          subcategory: sub.id,
          description: `Professional ${sub.name.toLowerCase()} service at your doorstep`,
          basePrice: 500,
          price: 500,
          duration: 60,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
      
      // Add all services to Firestore
      const promises = servicesToAdd.map(service => 
        addDoc(collection(db, 'services'), service)
      );
      
      await Promise.all(promises);
      
      toast.success(`Added ${servicesToAdd.length} services for missing subcategories`);
      fetchServices();
    } catch (error) {
      console.error('Error adding missing services:', error);
      toast.error('Failed to add missing services');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subcategory: '',
      description: '',
      price: 0,
      duration: '',
      image_url: '',
      discount_percentage: 0,
      is_active: true,
      service_type: 'platform' as 'platform' | 'vendor_service' | 'vendor_product',
      stock_quantity: 0,
      product_sku: '',
      vendor_price: 0,
      platform_margin_percentage: 20,
      requires_delivery: false,
      free_delivery_radius_km: 5,
      delivery_rate_per_km: 10,
      max_delivery_radius_km: 25
    });
    setEditingService(null);
    setShowAddDialog(false);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="p-6">Loading services...</div>;
  }

  if (filteredServices.length === 0 && services.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No services found. Seed the database to add sample data.</p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Service
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Add, edit, and manage services</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
          <Button 
            onClick={addMissingServices}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Missing Services
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{services.length}</div>
          <div className="text-sm text-gray-600">Total Services</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{services.filter(s => s.is_active).length}</div>
          <div className="text-sm text-gray-600">Active Services</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{services.filter(s => s.service_type === 'vendor_product').length}</div>
          <div className="text-sm text-gray-600">Vendor Products</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{categories.length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">{getSubcategoryName(service.subcategory)}</p>
                    <p className="text-xs text-gray-500">Categories: {getSubcategoryCategories(service.subcategory) || getCategoryName(service.category)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{service.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {service.discount_percentage && service.discount_percentage > 0 ? (
                    <>
                      <span className="text-lg font-bold text-green-600">₹{service.discounted_price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{service.price}</span>
                      <Badge className="bg-red-100 text-red-700">{service.discount_percentage}% OFF</Badge>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
                  )}
                </div>
                <span className="text-sm text-gray-600">{service.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-600">★ {service.rating} ({service.total_reviews})</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStatus(service.id, service.is_active)}
                >
                  {service.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={resetForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 45 mins"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategory *</Label>
              <Select 
                value={formData.subcategory} 
                onValueChange={handleSubcategoryChange}
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
              {formData.subcategory && (
                <p className="text-xs text-gray-500 mt-1">
                  Categories: {getSelectedSubcategoryCategories().map(catId => getCategoryName(catId)).join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <Label htmlFor="is_active">Active Service</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingService ? 'Update Service' : 'Add Service'}
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}