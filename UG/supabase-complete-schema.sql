-- UrbanGenie Complete Database Schema for Supabase
-- Run this script in Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(50) DEFAULT 'Hyderabad',
  pincode VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service categories
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  gradient VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(50),
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User addresses
CREATE TABLE public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'Home',
  address TEXT NOT NULL,
  city VARCHAR(50) DEFAULT 'Hyderabad',
  pincode VARCHAR(10),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table with compliance fields
CREATE TABLE public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  experience_years INTEGER DEFAULT 0,
  description TEXT,
  business_type VARCHAR(20) DEFAULT 'individual' CHECK (business_type IN ('individual', 'shop', 'company')),
  gstin VARCHAR(15),
  fssai_license VARCHAR(14),
  pan_number VARCHAR(10),
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  bank_account_holder_name VARCHAR(100),
  upi_id VARCHAR(50),
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor skills
CREATE TABLE public.vendor_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor availability
CREATE TABLE public.vendor_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor documents
CREATE TABLE public.vendor_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('gstin_certificate', 'fssai_license', 'pan_card', 'bank_passbook', 'aadhar_card')),
  document_url TEXT NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT
);

-- Orders
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) DEFAULT 49,
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_date DATE,
  scheduled_time TIME,
  address_id UUID REFERENCES addresses(id),
  assigned_vendor_id UUID REFERENCES vendors(id),
  assignment_status VARCHAR(20) DEFAULT 'unassigned',
  payment_method VARCHAR(20),
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
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
  status VARCHAR(20) DEFAULT 'assigned',
  vendor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items
CREATE TABLE public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendor_documents_vendor_id ON vendor_documents(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_documents_type ON vendor_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_vendor_skills_vendor_id ON vendor_skills(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_skills_service_id ON vendor_skills(service_id);

-- Insert sample data
INSERT INTO categories (name, description, icon, gradient) VALUES
('Beauty & Salon', 'Hair, makeup, spa & more at your doorstep', 'Sparkles', 'bg-gradient-to-br from-pink-500 to-purple-500'),
('Food & Beverages', 'Fresh meals, snacks & drinks delivered', 'Users', 'bg-gradient-to-br from-orange-500 to-red-500'),
('Wellness Services', 'Yoga, fitness & health at home', 'Shield', 'bg-gradient-to-br from-green-500 to-teal-500'),
('Clothing & Accessories', 'Tailoring, alterations & styling', 'Sparkles', 'bg-gradient-to-br from-blue-500 to-indigo-500');

INSERT INTO services (category_id, title, category, subcategory, description, price, duration, image_url, rating, total_reviews) VALUES
((SELECT id FROM categories WHERE name = 'Beauty & Salon'), 'Premium Hair Cut & Styling', 'Beauty & Salon', 'Hair Services', 'Professional haircut with styling by experienced stylists', 499, '45 mins', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop', 4.8, 256),
((SELECT id FROM categories WHERE name = 'Wellness Services'), 'Full Body Massage', 'Wellness Services', 'Massage Therapy', 'Relaxing Swedish massage therapy at your home', 1299, '60 mins', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop', 4.9, 189),
((SELECT id FROM categories WHERE name = 'Food & Beverages'), 'Gourmet Meal Prep', 'Food & Beverages', 'Meal Services', 'Healthy chef-prepared meals delivered fresh', 799, '30 mins', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', 4.7, 142),
((SELECT id FROM categories WHERE name = 'Clothing & Accessories'), 'Custom Tailoring', 'Clothing & Accessories', 'Tailoring Services', 'Expert alterations and custom stitching', 599, '3-5 days', 'https://images.unsplash.com/photo-1558769132-cb1aea41f9e5?w=400&h=300&fit=crop', 4.6, 98);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- Public read access for categories and services
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (is_active = true);

-- Vendor policies
CREATE POLICY "Anyone can view approved vendors" ON vendors FOR SELECT USING (verification_status = 'approved');
CREATE POLICY "Anyone can insert vendor applications" ON vendors FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view vendor skills" ON vendor_skills FOR SELECT USING (true);
CREATE POLICY "Anyone can insert vendor skills" ON vendor_skills FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view vendor availability" ON vendor_availability FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'UG' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to find nearby vendors
CREATE OR REPLACE FUNCTION find_nearby_vendors(
  service_category_id UUID,
  customer_lat DECIMAL,
  customer_lng DECIMAL,
  max_distance_km INTEGER DEFAULT 10
)
RETURNS TABLE (
  vendor_id UUID,
  vendor_name VARCHAR,
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
      JOIN services s ON vs.service_id = s.id
      WHERE vs.vendor_id = v.id 
      AND s.category_id = service_category_id
    ) as skill_match
  FROM vendors v
  WHERE v.is_active = true 
    AND v.verification_status = 'approved'
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