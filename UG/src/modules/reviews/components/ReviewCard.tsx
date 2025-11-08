import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ReviewCardProps {
  review: {
    id: number;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
    verified: boolean;
  };
  showService?: boolean;
  serviceName?: string;
}

const ReviewCard = ({ review, showService = false, serviceName }: ReviewCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold shrink-0">
          {review.userName.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{review.userName}</span>
            {review.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Verified
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{review.date}</span>
          </div>

          {showService && serviceName && (
            <div className="text-sm text-muted-foreground mb-2">
              Service: {serviceName}
            </div>
          )}
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            {review.comment}
          </p>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground p-0 h-auto">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Helpful ({review.helpful})
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;