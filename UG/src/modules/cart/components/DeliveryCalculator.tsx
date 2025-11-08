import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Mock implementation for development
import { MapPin, Truck } from 'lucide-react';

interface DeliveryCalculatorProps {
  serviceId: string;
  customerAddress?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onDeliveryUpdate: (charges: number, distance: number) => void;
}

interface DeliveryInfo {
  distance_km: number;
  delivery_charge: number;
  is_deliverable: boolean;
}

export default function DeliveryCalculator({ serviceId, customerAddress, onDeliveryUpdate }: DeliveryCalculatorProps) {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serviceId && customerAddress) {
      calculateDelivery();
    }
  }, [serviceId, customerAddress]);

  const calculateDelivery = async () => {
    if (!customerAddress) return;

    setLoading(true);
    try {
      // Mock service data
      const service = {
        requires_delivery: true,
        free_delivery_radius_km: 5,
        delivery_rate_per_km: 10,
        max_delivery_radius_km: 25,
        vendors: { latitude: 17.385, longitude: 78.486 }
      };
      const serviceError = null;

      // Skip if service doesn't require delivery
      if (!service.requires_delivery) {
        setDeliveryInfo({ distance_km: 0, delivery_charge: 0, is_deliverable: true });
        onDeliveryUpdate(0, 0);
        return;
      }

      // Skip if no vendor location
      if (!service.vendors?.latitude || !service.vendors?.longitude) {
        setDeliveryInfo({ distance_km: 0, delivery_charge: 0, is_deliverable: false });
        onDeliveryUpdate(0, 0);
        return;
      }

      // Mock delivery calculation
      const distance = 3.5; // Mock distance
      const delivery = {
        distance_km: distance,
        delivery_charge: distance > 5 ? (distance - 5) * 10 : 0,
        is_deliverable: distance <= 25
      };
      const deliveryError = null;
      setDeliveryInfo(delivery);
      onDeliveryUpdate(delivery.delivery_charge, delivery.distance_km);

    } catch (error) {
      console.error('Error calculating delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Calculating delivery charges...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!deliveryInfo) return null;

  if (!deliveryInfo.is_deliverable) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Delivery not available to your location</span>
          </div>
          <p className="text-xs text-red-500 mt-1">
            This item cannot be delivered to your address
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium">
                Delivery ({deliveryInfo.distance_km} km)
              </div>
              {customerAddress && (
                <div className="text-xs text-gray-500 truncate max-w-48">
                  to {customerAddress.address}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            {deliveryInfo.delivery_charge === 0 ? (
              <Badge className="bg-green-100 text-green-700">FREE</Badge>
            ) : (
              <span className="text-sm font-medium">₹{deliveryInfo.delivery_charge}</span>
            )}
          </div>
        </div>
        
        {deliveryInfo.delivery_charge === 0 && deliveryInfo.distance_km > 0 && (
          <p className="text-xs text-green-600 mt-2">
            Free delivery within delivery radius
          </p>
        )}
      </CardContent>
    </Card>
  );
}