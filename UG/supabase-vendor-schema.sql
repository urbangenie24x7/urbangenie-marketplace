-- Vendor Management Schema for UrbanGenie

-- Vendor profiles
CREATE TABLE public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  business_name VARCHAR(200),
  business_type VARCHAR(50), -- 'individual', 'shop', 'company'
  address TEXT NOT NULL,
  city VARCHAR(50) DEFAULT 'Hyderabad',
  pincode VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor skills/qualifications
CREATE TABLE public.vendor_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  skill_name VARCHAR(100) NOT NULL,
  experience_years INTEGER DEFAULT 0,
  certification_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor availability
CREATE TABLE public.vendor_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order assignments
CREATE TABLE public.order_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'assigned', -- 'assigned', 'accepted', 'started', 'completed', 'cancelled'
  vendor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update orders table to include assignment info
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS assigned_vendor_id UUID REFERENCES vendors(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS assignment_status VARCHAR(20) DEFAULT 'unassigned';

-- Insert sample vendors
INSERT INTO vendors (name, phone, email, business_name, business_type, address, pincode, latitude, longitude, rating, total_reviews, total_orders, is_verified) VALUES
('Rajesh Kumar', '+91 9876543210', 'rajesh@example.com', 'Rajesh Hair Studio', 'shop', 'Shop 12, Banjara Hills', '500034', 17.4065, 78.4691, 4.8, 156, 320, true),
('Priya Wellness', '+91 9876543211', 'priya@example.com', 'Priya Spa Services', 'individual', 'Jubilee Hills', '500033', 17.4326, 78.4071, 4.9, 89, 180, true),
('Gourmet Kitchen', '+91 9876543212', 'chef@gourmet.com', 'Gourmet Kitchen Services', 'company', 'Kondapur', '500084', 17.4647, 78.3639, 4.7, 234, 450, true),
('Tailor Master', '+91 9876543213', 'tailor@example.com', 'Master Tailoring', 'shop', 'Gachibowli', '500032', 17.4400, 78.3489, 4.6, 67, 120, true);

-- Insert sample vendor skills
INSERT INTO vendor_skills (vendor_id, category_id, skill_name, experience_years, is_verified) VALUES
((SELECT id FROM vendors WHERE name = 'Rajesh Kumar'), (SELECT id FROM categories WHERE name = 'Beauty & Salon'), 'Hair Cutting & Styling', 8, true),
((SELECT id FROM vendors WHERE name = 'Rajesh Kumar'), (SELECT id FROM categories WHERE name = 'Beauty & Salon'), 'Hair Coloring', 5, true),
((SELECT id FROM vendors WHERE name = 'Priya Wellness'), (SELECT id FROM categories WHERE name = 'Wellness Services'), 'Full Body Massage', 6, true),
((SELECT id FROM vendors WHERE name = 'Priya Wellness'), (SELECT id FROM categories WHERE name = 'Wellness Services'), 'Aromatherapy', 4, true),
((SELECT id FROM vendors WHERE name = 'Gourmet Kitchen'), (SELECT id FROM categories WHERE name = 'Food & Beverages'), 'Meal Preparation', 10, true),
((SELECT id FROM vendors WHERE name = 'Tailor Master'), (SELECT id FROM categories WHERE name = 'Clothing & Accessories'), 'Custom Tailoring', 12, true);

-- Insert sample availability (Monday to Saturday, 9 AM to 6 PM)
INSERT INTO vendor_availability (vendor_id, day_of_week, start_time, end_time) 
SELECT v.id, d.day, '09:00:00', '18:00:00'
FROM vendors v
CROSS JOIN (SELECT generate_series(1, 6) as day) d;

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can view own profile" ON vendors FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Vendors can update own profile" ON vendors FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Public can view active vendors" ON vendors FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "Vendors can manage own skills" ON vendor_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM vendors WHERE vendors.id = vendor_skills.vendor_id AND auth.uid()::text = vendors.id::text)
);

CREATE POLICY "Vendors can manage own availability" ON vendor_availability FOR ALL USING (
  EXISTS (SELECT 1 FROM vendors WHERE vendors.id = vendor_availability.vendor_id AND auth.uid()::text = vendors.id::text)
);

-- Function to find nearby vendors for a service
CREATE OR REPLACE FUNCTION find_nearby_vendors(
  service_category_id UUID,
  customer_lat DECIMAL,
  customer_lng DECIMAL,
  max_distance_km INTEGER DEFAULT 10
)
RETURNS TABLE (
  vendor_id UUID,
  vendor_name VARCHAR,
  business_name VARCHAR,
  phone VARCHAR,
  rating DECIMAL,
  distance_km DECIMAL,
  skill_match BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.name,
    v.business_name,
    v.phone,
    v.rating,
    ROUND(
      (6371 * acos(
        cos(radians(customer_lat)) * 
        cos(radians(v.latitude)) * 
        cos(radians(v.longitude) - radians(customer_lng)) + 
        sin(radians(customer_lat)) * 
        sin(radians(v.latitude))
      ))::numeric, 2
    ) as distance_km,
    EXISTS(
      SELECT 1 FROM vendor_skills vs 
      WHERE vs.vendor_id = v.id 
      AND vs.category_id = service_category_id 
      AND vs.is_verified = true
    ) as skill_match
  FROM vendors v
  WHERE v.is_active = true 
    AND v.is_verified = true
    AND (6371 * acos(
      cos(radians(customer_lat)) * 
      cos(radians(v.latitude)) * 
      cos(radians(v.longitude) - radians(customer_lng)) + 
      sin(radians(customer_lat)) * 
      sin(radians(v.latitude))
    )) <= max_distance_km
  ORDER BY 
    skill_match DESC,
    distance_km ASC,
    v.rating DESC;
END;
$$ LANGUAGE plpgsql;