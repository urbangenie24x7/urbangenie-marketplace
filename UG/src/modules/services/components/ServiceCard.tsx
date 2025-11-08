import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/cart/context/CartContext";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  image_url?: string;
  rating: number;
  duration: string;
  category?: string;
}

const ServiceCard = ({
  id,
  title,
  description,
  price,
  image,
  image_url,
  rating,
  duration,
  category,
}: ServiceCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to cart clicked for:', { id, title, price });
    addToCart({ id, title, price, image_url: serviceImage, duration });
  };
  
  const serviceImage = image_url || image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
  return (
    <div className="group bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      <Link to={`/service/${id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={serviceImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
            ₹{price}
          </div>
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/service/${id}`}>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          <div className="flex items-center space-x-1 text-sm shrink-0">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">{category}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
          <Link to={`/service/${id}`} className="flex-1">
            <Button className="w-full bg-gradient-primary hover:opacity-90" size="sm">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
