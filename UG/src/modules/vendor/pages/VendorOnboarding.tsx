import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// Mock implementation for development
import { toast } from 'sonner';
import { MapPin, Phone, User, FileText, Star, Clock } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  category: string;
  subcategory: string;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  experience_years: number;
  description: string;
  selected_skills: string[];
  business_type: 'individual' | 'shop' | 'company';
  gstin: string;
  fssai_license: string;
  pan_number: string;
  bank_account_number: string;
  bank_ifsc: string;
  bank_account_holder_name: string;
  upi_id: string;
  selected_categories: string[];
  selected_subcategories: string[];
}

export default function VendorOnboarding() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    latitude: null,
    longitude: null,
    experience_years: 0,
    description: '',
    selected_skills: [],
    business_type: 'individual',
    gstin: '',
    fssai_license: '',
    pan_number: '',
    bank_account_number: '',
    bank_ifsc: '',
    bank_account_holder_name: '',
    upi_id: '',
    selected_categories: [],
    selected_subcategories: []
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id, title, category, subcategory')
      .order('category', { ascending: true });

    if (error) {
      toast.error('Failed to load services');
      return;
    }

    setServices(data || []);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      toast.error('Failed to load categories');
      return;
    }

    setCategories(data || []);
  };

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from('subcategories')
      .select('id, category_id, name, description')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      toast.error('Failed to load subcategories');
      return;
    }

    setSubcategories(data || []);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          toast.success('Location captured successfully');
        },
        () => {
          toast.error('Failed to get location');
        }
      );
    }
  };

  const handleSkillToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_skills: prev.selected_skills.includes(serviceId)
        ? prev.selected_skills.filter(id => id !== serviceId)
        : [...prev.selected_skills, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.selected_categories.length === 0) {
      toast.error('Please select at least one service category');
      return;
    }

    if (formData.selected_subcategories.length === 0) {
      toast.error('Please select at least one subcategory');
      return;
    }

    if (formData.selected_skills.length === 0) {
      toast.error('Please select at least one specific service');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error('Please capture your location');
      return;
    }

    setLoading(true);

    try {
      // Insert vendor
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          experience_years: formData.experience_years,
          description: formData.description,
          business_type: formData.business_type,
          gstin: formData.gstin || null,
          fssai_license: formData.fssai_license || null,
          pan_number: formData.pan_number || null,
          bank_account_number: formData.bank_account_number,
          bank_ifsc: formData.bank_ifsc,
          bank_account_holder_name: formData.bank_account_holder_name,
          upi_id: formData.upi_id || null,
          verification_status: 'pending'
        })
        .select()
        .single();

      if (vendorError) throw vendorError;

      // Insert vendor skills
      const skillsData = formData.selected_skills.map(serviceId => ({
        vendor_id: vendor.id,
        service_id: serviceId
      }));

      const { error: skillsError } = await supabase
        .from('vendor_skills')
        .insert(skillsData);

      if (skillsError) throw skillsError;

      setSubmitted(true);
      toast.success('Application submitted successfully! We will review and contact you soon.');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for applying to become a vendor. Our admin team will review your application and contact you within 2-3 business days.
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedServices = services.reduce((acc, service) => {
    const key = `${service.category} - ${service.subcategory}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Become a Vendor</CardTitle>
            <p className="text-center text-gray-600">Join our platform and start providing services to customers</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="mt-2"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Capture Current Location
                </Button>
                {formData.latitude && formData.longitude && (
                  <p className="text-sm text-green-600 mt-1">
                    Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Years of Experience *
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>

              {/* Business Type */}
              <div>
                <Label htmlFor="business_type">Business Type *</Label>
                <select
                  id="business_type"
                  value={formData.business_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_type: e.target.value as 'individual' | 'shop' | 'company' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="individual">Individual Service Provider</option>
                  <option value="shop">Local Shop/Store</option>
                  <option value="company">Registered Company</option>
                </select>
              </div>

              {/* Service Categories */}
              <div>
                <Label className="text-lg font-semibold">Service Categories *</Label>
                <p className="text-sm text-gray-600 mb-4">Select the main categories you work in</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={formData.selected_categories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              selected_categories: [...prev.selected_categories, category.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              selected_categories: prev.selected_categories.filter(id => id !== category.id),
                              selected_subcategories: prev.selected_subcategories.filter(subId => {
                                const subcategory = subcategories.find(s => s.id === subId);
                                return subcategory && prev.selected_categories.includes(subcategory.category_id);
                              })
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={category.id} className="text-sm font-medium">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {formData.selected_categories.length > 0 && (
                <div>
                  <Label className="text-lg font-semibold">Subcategories *</Label>
                  <p className="text-sm text-gray-600 mb-4">Select specific subcategories within your chosen categories</p>
                  
                  <div className="space-y-4">
                    {formData.selected_categories.map(categoryId => {
                      const category = categories.find(c => c.id === categoryId);
                      const categorySubcategories = subcategories.filter(sub => sub.category_id === categoryId);
                      
                      return (
                        <div key={categoryId} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">{category?.name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {categorySubcategories.map(subcategory => (
                              <div key={subcategory.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={subcategory.id}
                                  checked={formData.selected_subcategories.includes(subcategory.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        selected_subcategories: [...prev.selected_subcategories, subcategory.id]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        selected_subcategories: prev.selected_subcategories.filter(sub => sub !== subcategory.id)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={subcategory.id} className="text-sm">
                                  {subcategory.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legal Compliance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Legal Compliance</h3>
                
                {formData.business_type === 'company' && (
                  <div>
                    <Label htmlFor="gstin">GSTIN Number *</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value }))}
                      placeholder="22AAAAA0000A1Z5"
                      maxLength={15}
                      required={formData.business_type === 'company'}
                    />
                  </div>
                )}
                
                {(formData.business_type === 'shop' || formData.business_type === 'company') && (
                  <div>
                    <Label htmlFor="fssai_license">FSSAI License Number (if food/beverage services)</Label>
                    <Input
                      id="fssai_license"
                      value={formData.fssai_license}
                      onChange={(e) => setFormData(prev => ({ ...prev, fssai_license: e.target.value }))}
                      placeholder="12345678901234"
                      maxLength={14}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="pan_number">PAN Number *</Label>
                  <Input
                    id="pan_number"
                    value={formData.pan_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank_account_holder_name">Account Holder Name *</Label>
                    <Input
                      id="bank_account_holder_name"
                      value={formData.bank_account_holder_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_account_holder_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_account_number">Bank Account Number *</Label>
                    <Input
                      id="bank_account_number"
                      value={formData.bank_account_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_account_number: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank_ifsc">IFSC Code *</Label>
                    <Input
                      id="bank_ifsc"
                      value={formData.bank_ifsc}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_ifsc: e.target.value.toUpperCase() }))}
                      placeholder="SBIN0001234"
                      maxLength={11}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="upi_id">UPI ID (Optional)</Label>
                    <Input
                      id="upi_id"
                      value={formData.upi_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
                      placeholder="yourname@paytm"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  About Yourself
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about your experience, certifications, and why you'd be a great vendor..."
                />
              </div>

              {/* Specific Services */}
              {formData.selected_subcategories.length > 0 && (
                <div>
                  <Label className="text-lg font-semibold">Specific Services *</Label>
                  <p className="text-sm text-gray-600 mb-4">Choose the exact services you can provide</p>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {formData.selected_subcategories.map(subcategoryId => {
                      const subcategory = subcategories.find(sub => sub.id === subcategoryId);
                      const subcategoryServices = services.filter(s => s.subcategory === subcategory?.name);
                      
                      return (
                        <div key={subcategoryId} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">{subcategory?.name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {subcategoryServices.map((service) => (
                              <div key={service.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={service.id}
                                  checked={formData.selected_skills.includes(service.id)}
                                  onCheckedChange={() => handleSkillToggle(service.id)}
                                />
                                <Label htmlFor={service.id} className="text-sm">
                                  {service.title}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {formData.selected_skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Selected Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.selected_skills.map((skillId) => {
                          const service = services.find(s => s.id === skillId);
                          return service ? (
                            <Badge key={skillId} variant="secondary">
                              {service.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}