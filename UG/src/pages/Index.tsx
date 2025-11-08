import { useEffect, useState } from "react";
import { Search, Shield, Clock, CheckCircle, Users, Sparkles } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import CategoryCard from "@/modules/services/components/CategoryCard";
import ServiceCard from "@/modules/services/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "@/modules/cart/context/CartContext";

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart, itemCount } = useCart();
  
  const testAddToCart = () => {
    console.log('Test button clicked');
    addToCart({
      id: 'test-123',
      title: 'Test Service',
      price: 100,
      image_url: 'test.jpg',
      duration: '30 mins'
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories from Firebase
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        title: doc.data().name,
        description: doc.data().description || getDescriptionForCategory(doc.data().name),
        gradient: getGradientForCategory(doc.data().name),
        icon: getIconForCategory(doc.data().name),
        link: `/services?category=${doc.id}`
      })).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setCategories(categoriesData);

      // Fetch subcategories from Firebase
      const subcategoriesSnapshot = await getDocs(collection(db, 'subcategories'));
      const subcategoriesData = subcategoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        categories: doc.data().categories || []
      }));
      setSubcategories(subcategoriesData);

      // Fetch services and resolve category/subcategory names
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const allServices = servicesSnapshot.docs.map(doc => {
        const categoryName = getCategoryName(doc.data().category, categoriesData);
        const subcategoryName = getSubcategoryName(doc.data().subcategory, subcategoriesData);
        
        return {
          id: doc.id,
          ...doc.data(),
          title: doc.data().name || doc.data().title,
          price: doc.data().basePrice || doc.data().price,
          image: getImageForService(subcategoryName),
          rating: 4.8,
          duration: `${doc.data().duration || 60} mins`,
          category: doc.data().category,
          categoryName,
          subcategoryName
        };
      }).filter(service => service.isActive !== false);

      // Sort services by category and select featured ones
      const servicesByCategory = {};
      allServices.forEach(service => {
        if (!servicesByCategory[service.category]) {
          servicesByCategory[service.category] = [];
        }
        servicesByCategory[service.category].push(service);
      });

      // Select 1 service from each category for featured services
      const featuredServices = [];
      Object.keys(servicesByCategory).forEach(category => {
        if (featuredServices.length < 4) {
          featuredServices.push(servicesByCategory[category][0]);
        }
      });
      
      setFeaturedServices(featuredServices);
      setAllServices(allServices);
    } catch (error) {
      console.error('Error fetching data:', error);
      setCategories([]);
      setFeaturedServices([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string, categoriesData: any[]) => {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getSubcategoryName = (subcategoryId: string, subcategoriesData: any[]) => {
    const subcategory = subcategoriesData.find(sub => sub.id === subcategoryId);
    return subcategory ? subcategory.name : subcategoryId;
  };

  const getGradientForCategory = (categoryName: string) => {
    const gradients = {
      'Beauty & Wellness': 'bg-gradient-to-br from-pink-500 to-purple-500',
      'Cleaning': 'bg-gradient-to-br from-blue-500 to-indigo-500', 
      'Home Maintenance': 'bg-gradient-to-br from-orange-500 to-red-500',
      'Appliance Repair': 'bg-gradient-to-br from-green-500 to-teal-500'
    };
    return gradients[categoryName] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  const getIconForCategory = (categoryName: string) => {
    const icons = {
      'Beauty & Wellness': Sparkles,
      'Cleaning': Shield,
      'Home Maintenance': Users, 
      'Appliance Repair': Clock
    };
    return icons[categoryName] || Users;
  };

  const getDescriptionForCategory = (categoryName: string) => {
    const descriptions = {
      'Beauty & Wellness': 'Hair, makeup, spa & more at your doorstep',
      'Cleaning': 'Professional cleaning services for your home',
      'Home Maintenance': 'Repair and maintenance services',
      'Appliance Repair': 'Fix and service your home appliances'
    };
    return descriptions[categoryName] || 'Professional services at your doorstep';
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    
    const suggestions = [];
    const searchLower = value.toLowerCase();
    
    // Add matching subcategories only
    subcategories
      .filter(sub => sub.name.toLowerCase().includes(searchLower))
      .slice(0, 6)
      .forEach(subcategory => {
        suggestions.push({
          name: subcategory.name,
          type: 'Subcategory',
          link: `/services?subcategory=${subcategory.id}`,
          data: subcategory
        });
      });
    
    setSearchSuggestions(suggestions);
  };
  
  const handleSuggestionClick = (suggestion: any) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    window.location.href = suggestion.link;
  };
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const getImageForService = (subcategory: string) => {
    const images = {
      'Plumbing': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      'Electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'AC Services': 'https://images.unsplash.com/photo-1631545806609-c2b9e7b1b8e5?w=400&h=300&fit=crop',
      'Regular Cleaning': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'Deep Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      'Salon at Home': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
      'Washing Machine': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    };
    return images[subcategory] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop';
  };

  const mockCategories = [
    {
      title: "Beauty & Salon",
      description: "Hair, makeup, spa & more at your doorstep",
      icon: Sparkles,
      link: "/services?category=beauty",
      gradient: "bg-gradient-to-br from-pink-500 to-purple-500",
    },
    {
      title: "Food & Beverages",
      description: "Fresh meals, snacks & drinks delivered",
      icon: Users,
      link: "/services?category=food",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
    },
    {
      title: "Wellness Services",
      description: "Yoga, fitness & health at home",
      icon: Shield,
      link: "/services?category=wellness",
      gradient: "bg-gradient-to-br from-green-500 to-teal-500",
    },
    {
      title: "Clothing & Accessories",
      description: "Tailoring, alterations & styling",
      icon: Sparkles,
      link: "/services?category=clothing",
      gradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
    },
  ];

  const mockFeaturedServices = [
    {
      id: "1",
      title: "Premium Hair Cut & Styling",
      description: "Professional haircut with styling by experienced stylists",
      price: 499,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      rating: 4.8,
      duration: "45 mins",
      category: "Beauty",
    },
    {
      id: "2",
      title: "Full Body Massage",
      description: "Relaxing Swedish massage therapy at your home",
      price: 1299,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      rating: 4.9,
      duration: "60 mins",
      category: "Wellness",
    },
    {
      id: "3",
      title: "Gourmet Meal Prep",
      description: "Healthy chef-prepared meals delivered fresh",
      price: 799,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      rating: 4.7,
      duration: "30 mins",
      category: "Food",
    },
    {
      id: "4",
      title: "Custom Tailoring",
      description: "Expert alterations and custom stitching",
      price: 599,
      image: "https://images.unsplash.com/photo-1558769132-cb1aea41f9e5?w=400&h=300&fit=crop",
      rating: 4.6,
      duration: "3-5 days",
      category: "Clothing",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Trusted professionals",
      description: "Background verified and trained experts",
    },
    {
      icon: Clock,
      title: "On-time service",
      description: "Punctual service at your convenience",
    },
    {
      icon: CheckCircle,
      title: "Satisfaction guaranteed",
      description: "100% refund if not satisfied",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Home services, on demand.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced, hand-picked Professionals to serve you at your doorstep
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mt-8 relative">
              <div className="flex bg-white border-2 border-gray-200 rounded-lg p-1 shadow-sm">
                <Input
                  type="text"
                  placeholder="Search for services"
                  className="border-0 focus-visible:ring-0 text-gray-700 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-md"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{suggestion.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {suggestion.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What are you looking for?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading categories...</div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No categories found. Please add categories in the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Most booked services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading services...</div>
            ) : featuredServices.length > 0 ? (
              featuredServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  {...service}
                  category={service.categoryName}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No services found. Please add services in the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">UG</span>
                </div>
                <span className="font-bold text-lg">UrbanGenie24x7</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for all doorstep services in Hyderabad.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Beauty & Salon</li>
                <li>Food & Beverages</li>
                <li>Wellness</li>
                <li>Clothing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/vendor/onboarding" className="hover:text-primary transition-colors">Become a Vendor</a></li>
                <li><a href="/vendor/login" className="hover:text-primary transition-colors">Vendor Login</a></li>
                <li><a href="/vendor/dashboard" className="hover:text-primary transition-colors">Vendor Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>FAQs</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 UrbanGenie24x7. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
