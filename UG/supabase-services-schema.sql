-- Add discount fields to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS discounted_price DECIMAL(10,2);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS discount_start_date DATE;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS discount_end_date DATE;

-- Add constraint for discount percentage
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_discount_percentage_check') THEN
    ALTER TABLE public.services ADD CONSTRAINT services_discount_percentage_check CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
  END IF;
END $$;

-- Create function to automatically calculate discounted price
CREATE OR REPLACE FUNCTION calculate_discounted_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.discount_percentage > 0 THEN
    NEW.discounted_price := NEW.price * (1 - NEW.discount_percentage / 100);
  ELSE
    NEW.discounted_price := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate discounted price
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_calculate_discounted_price') THEN
    CREATE TRIGGER trigger_calculate_discounted_price
      BEFORE INSERT OR UPDATE ON services
      FOR EACH ROW
      EXECUTE FUNCTION calculate_discounted_price();
  END IF;
END $$;