import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, ThumbsUp, Filter } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const ServiceReviews = () => {
  const { serviceId } = useParams();
  const [sortBy, setSortBy] = useState("recent");

  // Mock data - would come from API
  const service = {
    title: "Premium Hair Cut & Styling",
    rating: 4.8,
    totalReviews: 256,
    ratingBreakdown: {
      5: 180,
      4: 45,
      3: 20,
      2: 8,
      1: 3
    }
  };

  const reviews = [
    {
      id: 1,
      userName: "Priya Sharma",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent service! The stylist was very professional and gave me exactly what I wanted. Highly recommend!",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      userName: "Rahul Verma",
      rating: 4,
      date: "1 week ago",
      comment: "Good haircut, arrived on time. The stylist was skilled but could have been more interactive.",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      userName: "Sneha Patel",
      rating: 5,
      date: "2 weeks ago",
      comment: "Amazing experience! Professional service, great results. Will definitely book again.",
      helpful: 15,
      verified: true
    },
    {
      id: 4,
      userName: "Amit Kumar",
      rating: 3,
      date: "3 weeks ago",
      comment: "Service was okay. The stylist was good but arrived 15 minutes late.",
      helpful: 3,
      verified: true
    }
  ];

  const getRatingPercentage = (stars: number) => {
    return (service.ratingBreakdown[stars as keyof typeof service.ratingBreakdown] / service.totalReviews) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Reviews for {service.title}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold ml-1">{service.rating}</span>
              </div>
              <span className="text-muted-foreground">({service.totalReviews} reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Rating Breakdown</h3>
                
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm">{stars}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress 
                        value={getRatingPercentage(stars)} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-muted-foreground w-8">
                        {service.ratingBreakdown[stars as keyof typeof service.ratingBreakdown]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{service.rating}</div>
                    <div className="flex justify-center my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(service.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {service.totalReviews} reviews
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {/* Sort Controls */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Customer Reviews</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.userName}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
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
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceReviews;