-- Add vendor products support to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS service_type VARCHAR(20) DEFAULT 'platform' CHECK (service_type IN ('platform', 'vendor_service', 'vendor_product'));
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT NULL;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS max_order_quantity INTEGER DEFAULT NULL;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS product_sku VARCHAR(50);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(8,3);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100);

-- Create index for vendor products
CREATE INDEX IF NOT EXISTS idx_services_vendor_id ON services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_services_type ON services(service_type);

-- Update RLS policies for vendor products
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Vendors can manage own products') THEN
    CREATE POLICY "Vendors can manage own products" ON services 
    FOR ALL USING (vendor_id IS NULL OR vendor_id::text = auth.uid()::text);
  END IF;
END $$;