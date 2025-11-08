import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/shared/components/Navbar";
import ServiceCard from "@/modules/services/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, ChevronRight, Home } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Services = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const subcategoryId = searchParams.get("subcategory");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [categoryId, subcategoryId]);

  const fetchServices = async () => {
    try {
      // Fetch categories and subcategories first
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        ...doc.data()
      }));
      setCategories(categoriesData);
      
      const subcategoriesSnapshot = await getDocs(collection(db, 'subcategories'));
      const subcategoriesData = subcategoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        categories: doc.data().categories || []
      }));
      setSubcategories(subcategoriesData);

      // Resolve category/subcategory by name if needed
      let resolvedCategoryId = categoryId;
      let resolvedSubcategoryId = subcategoryId;
      
      // Check if categoryId is actually a category name instead of ID
      if (categoryId && !categoriesData.find(cat => cat.id === categoryId)) {
        const categoryByName = categoriesData.find(cat => 
          cat.name.toLowerCase() === categoryId.toLowerCase()
        );
        if (categoryByName) {
          resolvedCategoryId = categoryByName.id;
        } else {
          // Check if it's a subcategory name
          const subcategoryByName = subcategoriesData.find(sub => 
            sub.name.toLowerCase() === categoryId.toLowerCase()
          );
          if (subcategoryByName) {
            resolvedSubcategoryId = subcategoryByName.id;
            resolvedCategoryId = null;
          }
        }
      }

      // Fetch all services first
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      let servicesData = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        title: doc.data().name || doc.data().title,
        price: doc.data().basePrice || doc.data().price,
        image: getImageForService(doc.data().subcategory),
        rating: 4.8,
        duration: `${doc.data().duration || 60} mins`
      }));
      
      // Filter services based on category/subcategory
      if (resolvedSubcategoryId) {
        // Filter by subcategory ID
        servicesData = servicesData.filter(service => service.subcategory === resolvedSubcategoryId);
      } else if (resolvedCategoryId) {
        // Filter by category ID - include services whose subcategory is linked to this category
        servicesData = servicesData.filter(service => {
          // Check if service's primary category matches
          if (service.category === resolvedCategoryId) return true;
          
          // Check if service's subcategory is linked to this category
          const serviceSubcategory = subcategoriesData.find(sub => sub.id === service.subcategory);
          return serviceSubcategory && serviceSubcategory.categories && 
                 serviceSubcategory.categories.includes(resolvedCategoryId);
        });
      }

      
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
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

  const mockServices = [
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
    {
      id: "5",
      title: "Bridal Makeup",
      description: "Complete bridal makeup package with trial",
      price: 8999,
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
      rating: 4.9,
      duration: "3 hours",
      category: "Beauty",
    },
    {
      id: "6",
      title: "Yoga Session",
      description: "Personal yoga training at your home",
      price: 699,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
      rating: 4.7,
      duration: "60 mins",
      category: "Wellness",
    },
    {
      id: "7",
      title: "Party Catering",
      description: "Delicious food for your gatherings",
      price: 15000,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop",
      rating: 4.8,
      duration: "Per event",
      category: "Food",
    },
    {
      id: "8",
      title: "Shoe Repair & Cleaning",
      description: "Professional shoe care services",
      price: 299,
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop",
      rating: 4.5,
      duration: "2-3 days",
      category: "Clothing",
    },
  ];

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    // Check if categoryId is actually a category or subcategory name
    if (categoryId && !categories.find(cat => cat.id === categoryId)) {
      const categoryByName = categories.find(cat => 
        cat.name.toLowerCase() === categoryId.toLowerCase()
      );
      if (categoryByName) {
        breadcrumbs.push({ name: categoryByName.name, link: null });
        return breadcrumbs;
      }
      
      const subcategoryByName = subcategories.find(sub => 
        sub.name.toLowerCase() === categoryId.toLowerCase()
      );
      if (subcategoryByName) {
        // Add parent categories
        if (subcategoryByName.categories && subcategoryByName.categories.length > 0) {
          const parentCategory = categories.find(cat => cat.id === subcategoryByName.categories[0]);
          if (parentCategory) {
            breadcrumbs.push({ 
              name: parentCategory.name, 
              link: `/services?category=${parentCategory.id}` 
            });
          }
        }
        breadcrumbs.push({ name: subcategoryByName.name, link: null });
        return breadcrumbs;
      }
    }
    
    if (subcategoryId) {
      const subcategory = subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) {
        // Add parent categories
        if (subcategory.categories && subcategory.categories.length > 0) {
          const parentCategory = categories.find(cat => cat.id === subcategory.categories[0]);
          if (parentCategory) {
            breadcrumbs.push({ 
              name: parentCategory.name, 
              link: `/services?category=${parentCategory.id}` 
            });
          }
        }
        breadcrumbs.push({ name: subcategory.name, link: null });
        return breadcrumbs;
      }
    }
    
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        breadcrumbs.push({ name: category.name, link: null });
        return breadcrumbs;
      }
    }
    
    breadcrumbs.push({ name: 'All Services', link: null });
    return breadcrumbs;
  };

  const getCategoryTitle = () => {
    // Check if categoryId is actually a category or subcategory name
    if (categoryId && !categories.find(cat => cat.id === categoryId)) {
      const categoryByName = categories.find(cat => 
        cat.name.toLowerCase() === categoryId.toLowerCase()
      );
      if (categoryByName) {
        return `${categoryByName.name} Services`;
      }
      
      const subcategoryByName = subcategories.find(sub => 
        sub.name.toLowerCase() === categoryId.toLowerCase()
      );
      if (subcategoryByName) {
        return `${subcategoryByName.name} Services`;
      }
    }
    
    if (subcategoryId) {
      const subcategory = subcategories.find(sub => sub.id === subcategoryId);
      return subcategory ? `${subcategory.name} Services` : "Services";
    }
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      return category ? `${category.name} Services` : "Services";
    }
    return "All Services";
  };

  const filteredServices = services.filter(service => 
    service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-purple-600 flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </a>
          <ChevronRight className="w-4 h-4" />
          {getBreadcrumbs().map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.link ? (
                <a href={crumb.link} className="hover:text-purple-600">
                  {crumb.name}
                </a>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.name}</span>
              )}
              {index < getBreadcrumbs().length - 1 && <ChevronRight className="w-4 h-4" />}
            </div>
          ))}
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{getCategoryTitle()}</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredServices.length} services available`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl shadow-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading services...</div>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {services.length === 0 ? 'No services found. Please seed the database to add sample data.' : 'No services match your search criteria.'}
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;
