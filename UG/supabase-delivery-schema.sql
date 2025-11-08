-- Add delivery fields to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS requires_delivery BOOLEAN DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS free_delivery_radius_km DECIMAL(5,2) DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS delivery_rate_per_km DECIMAL(8,2) DEFAULT 10;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS max_delivery_radius_km DECIMAL(5,2) DEFAULT 25;

-- Add delivery fields to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_distance_km DECIMAL(8,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_charges DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_latitude DECIMAL(10,8);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_longitude DECIMAL(11,8);

-- Create function to calculate delivery charges
CREATE OR REPLACE FUNCTION calculate_delivery_charges(
  vendor_lat DECIMAL,
  vendor_lng DECIMAL,
  customer_lat DECIMAL,
  customer_lng DECIMAL,
  free_radius DECIMAL DEFAULT 0,
  rate_per_km DECIMAL DEFAULT 10,
  max_radius DECIMAL DEFAULT 25
)
RETURNS TABLE (
  distance_km DECIMAL,
  delivery_charge DECIMAL,
  is_deliverable BOOLEAN
) AS $$
DECLARE
  calculated_distance DECIMAL;
  calculated_charge DECIMAL;
BEGIN
  -- Calculate distance using Haversine formula
  calculated_distance := ROUND(
    (6371 * acos(
      cos(radians(customer_lat)) * 
      cos(radians(vendor_lat)) * 
      cos(radians(vendor_lng) - radians(customer_lng)) + 
      sin(radians(customer_lat)) * 
      sin(radians(vendor_lat))
    ))::numeric, 2
  );
  
  -- Check if within delivery radius
  IF calculated_distance > max_radius THEN
    RETURN QUERY SELECT calculated_distance, 0::DECIMAL, false;
    RETURN;
  END IF;
  
  -- Calculate delivery charge
  IF calculated_distance <= free_radius THEN
    calculated_charge := 0;
  ELSE
    calculated_charge := ROUND(((calculated_distance - free_radius) * rate_per_km)::numeric, 2);
  END IF;
  
  RETURN QUERY SELECT calculated_distance, calculated_charge, true;
END;
$$ LANGUAGE plpgsql;