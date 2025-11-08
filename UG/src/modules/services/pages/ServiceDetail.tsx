import { useParams, Link } from "react-router-dom";
import { Star, Clock, MapPin, Shield, Calendar, MessageSquare } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServiceDetail = () => {
  const { id } = useParams();

  // Mock service data - will be from API/database later
  const service = {
    id,
    title: "Premium Hair Cut & Styling",
    description: "Professional haircut with styling by experienced stylists. Includes consultation, wash, cut, blow-dry, and styling.",
    price: 499,
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop",
    ],
    rating: 4.8,
    reviews: 256,
    duration: "45 mins",
    category: "Beauty & Salon",
    available: true,
  };

  const features = [
    { icon: Shield, text: "Background verified professionals" },
    { icon: Clock, text: "Service within 60 minutes" },
    { icon: MapPin, text: "Available in your area" },
  ];

  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent service! The stylist was very professional and gave me exactly what I wanted.",
    },
    {
      id: 2,
      name: "Rahul Verma",
      rating: 4,
      date: "1 week ago",
      comment: "Good haircut, arrived on time. Would recommend!",
    },
    {
      id: 3,
      name: "Sneha Patel",
      rating: 5,
      date: "2 weeks ago",
      comment: "Amazing experience. Will book again for sure.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {service.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                  <img src={image} alt={`${service.title} ${index + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{service.title}</h1>
                {service.available && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Available
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <Link to={`/service/${id}/reviews`} className="flex items-center space-x-1 hover:text-primary transition-colors">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{service.rating}</span>
                  <span>({service.reviews} reviews)</span>
                </Link>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{service.duration}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-primary">₹{service.price}</span>
                <span className="text-muted-foreground">per service</span>
              </div>
              {service.vendor_price && (
                <div className="text-sm text-muted-foreground">
                  <span>Vendor price: ₹{service.vendor_price}</span>
                  <span className="mx-2">•</span>
                  <span>Platform fee: ₹{service.platform_fee}</span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{service.description}</p>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <feature.icon className="w-5 h-5 text-primary" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Select Date & Time</h3>
              <Button className="w-full" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Choose Time Slot
              </Button>
              <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                Add to Cart
              </Button>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-accent hover:opacity-90" size="lg">
                  Book Now
                </Button>
                <Link to={`/service/${id}/reviews`} className="flex-1">
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Reviews
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Service Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">What's Included:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Professional consultation</li>
                    <li>Hair wash with premium products</li>
                    <li>Precision haircut</li>
                    <li>Blow-dry and styling</li>
                    <li>Post-service care tips</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Please ensure adequate space</li>
                    <li>Power outlet access required</li>
                    <li>Clean towels (optional)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="faq" className="mt-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">How do I book a service?</h4>
                  <p className="text-sm text-muted-foreground">
                    Simply select your preferred date and time, add to cart, and proceed to checkout. You can also book instantly with the "Book Now" button.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I reschedule my booking?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can reschedule up to 2 hours before your scheduled time through your account dashboard.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What if I'm not satisfied?</h4>
                  <p className="text-sm text-muted-foreground">
                    We offer a 100% satisfaction guarantee. If you're not happy with the service, contact our support team within 24 hours.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServiceDetail;
