-- Add vendor pricing and platform margin fields
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS vendor_price DECIMAL(10,2);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS platform_margin_percentage DECIMAL(5,2) DEFAULT 20;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2);

-- Create function to calculate customer price (vendor price + margin)
CREATE OR REPLACE FUNCTION calculate_customer_price()
RETURNS TRIGGER AS $$
BEGIN
  -- For vendor services/products, calculate customer price from vendor price + margin
  IF NEW.vendor_id IS NOT NULL AND NEW.vendor_price IS NOT NULL THEN
    NEW.platform_fee := NEW.vendor_price * (NEW.platform_margin_percentage / 100);
    NEW.price := NEW.vendor_price + NEW.platform_fee;
  END IF;
  
  -- Calculate discounted price if discount exists
  IF NEW.discount_percentage > 0 THEN
    NEW.discounted_price := NEW.price * (1 - NEW.discount_percentage / 100);
  ELSE
    NEW.discounted_price := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing trigger to include pricing calculation
DROP TRIGGER IF EXISTS trigger_calculate_discounted_price ON services;
CREATE TRIGGER trigger_calculate_customer_price
  BEFORE INSERT OR UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION calculate_customer_price();