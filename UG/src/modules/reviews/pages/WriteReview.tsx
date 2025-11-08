import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const WriteReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  const orderId = searchParams.get('order');
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock service data - would come from props/API
  const service = {
    title: "Premium Hair Cut & Styling",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
    date: "2024-01-15"
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Review submitted successfully!");
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold">Write Review</h1>
          </div>

          {/* Service Info */}
          <Card className="p-6 mb-6">
            <div className="flex gap-4">
              <img
                src={service.image}
                alt={service.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-muted-foreground">Service completed on {service.date}</p>
              </div>
            </div>
          </Card>

          {/* Review Form */}
          <Card className="p-6">
            <div className="space-y-6">
              {/* Rating */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">
                  How was your experience?
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="p-1 transition-transform hover:scale-110"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {rating > 0 && (
                    <span>
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent"}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment" className="text-lg font-semibold">
                  Tell us more about your experience
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share details about the service quality, professionalism, punctuality, etc."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-2 min-h-[120px]"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {comment.length}/500 characters
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={loading || rating === 0}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Guidelines */}
          <Card className="p-4 mt-6 bg-muted/50">
            <h4 className="font-semibold mb-2">Review Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on the service quality and experience</li>
              <li>• Avoid personal information or inappropriate content</li>
              <li>• Help other customers make informed decisions</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;