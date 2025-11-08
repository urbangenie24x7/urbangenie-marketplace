-- Sample Data for UrbanGenie Platform
-- Run this after the main schema is set up

-- Sample Customers
INSERT INTO users (id, phone, name, email, address, city, pincode) VALUES
(gen_random_uuid(), '+919876543001', 'Arjun Reddy', 'arjun@example.com', 'Flat 301, Cyber Towers, Madhapur', 'Hyderabad', '500081'),
(gen_random_uuid(), '+919876543002', 'Priya Sharma', 'priya@example.com', 'Villa 15, Jubilee Hills', 'Hyderabad', '500033'),
(gen_random_uuid(), '+919876543003', 'Rahul Kumar', 'rahul@example.com', 'Apartment 2B, Banjara Hills', 'Hyderabad', '500034'),
(gen_random_uuid(), '+919876543004', 'Sneha Patel', 'sneha@example.com', 'House 45, Kondapur', 'Hyderabad', '500084'),
(gen_random_uuid(), '+919876543005', 'Vikram Singh', 'vikram@example.com', 'Tower A, Gachibowli', 'Hyderabad', '500032')
ON CONFLICT (phone) DO NOTHING;

-- Sample Customer Addresses
INSERT INTO addresses (user_id, type, address, city, pincode, is_default)
SELECT u.id, 'Home', u.address, u.city, u.pincode, true
FROM users u
WHERE u.phone IN ('+919876543001', '+919876543002', '+919876543003', '+919876543004', '+919876543005');

-- Sample Approved Vendors
INSERT INTO vendors (
  name, phone, email, address, latitude, longitude, 
  experience_years, description, business_type, pan_number,
  bank_account_number, bank_ifsc, bank_account_holder_name, upi_id,
  verification_status, rating, total_reviews, total_orders, is_active
) VALUES
('Rajesh Hair Studio', '+919876540001', 'rajesh@hairstudio.com', 'Shop 12, Banjara Hills Road', 17.4065, 78.4691, 8, 'Professional hair styling and grooming services', 'shop', 'ABCDE1234F', '1234567890123456', 'SBIN0001234', 'Rajesh Kumar', 'rajesh@paytm', 'approved', 4.8, 156, 320, true),
('Priya Wellness Spa', '+919876540002', 'priya@wellness.com', 'Villa 8, Jubilee Hills', 17.4326, 78.4071, 6, 'Certified massage therapist and wellness expert', 'individual', 'BCDEF2345G', '2345678901234567', 'HDFC0002345', 'Priya Sharma', 'priya@gpay', 'approved', 4.9, 89, 180, true),
('Gourmet Kitchen Co', '+919876540003', 'chef@gourmet.com', 'Commercial Complex, Kondapur', 17.4647, 78.3639, 10, 'Professional catering and meal preparation services', 'company', 'CDEFG3456H', '3456789012345678', 'ICICI003456', 'Gourmet Kitchen Pvt Ltd', 'gourmet@phonepe', 'approved', 4.7, 234, 450, true),
('Master Tailoring', '+919876540004', 'tailor@master.com', 'Shop 25, Gachibowli Main Road', 17.4400, 78.3489, 12, 'Expert tailoring and alterations specialist', 'shop', 'DEFGH4567I', '4567890123456789', 'AXIS0004567', 'Suresh Master', 'suresh@paytm', 'approved', 4.6, 67, 120, true),
('Clean Home Services', '+919876540005', 'clean@home.com', 'Flat 101, Miyapur', 17.4948, 78.3563, 5, 'Professional home cleaning and maintenance', 'individual', 'EFGHI5678J', '5678901234567890', 'SBI0005678', 'Lakshmi Devi', 'lakshmi@gpay', 'approved', 4.5, 98, 200, true)
ON CONFLICT (phone) DO NOTHING;

-- Sample Pending Vendors
INSERT INTO vendors (
  name, phone, email, address, latitude, longitude, 
  experience_years, description, business_type, pan_number,
  bank_account_number, bank_ifsc, bank_account_holder_name, upi_id,
  verification_status, rating, total_reviews, total_orders, is_active
) VALUES
('Tech Repair Hub', '+919876540006', 'tech@repair.com', 'Shop 5, Kukatpally', 17.4850, 78.4867, 4, 'Electronics and gadget repair services', 'shop', 'FGHIJ6789K', '6789012345678901', 'HDFC0006789', 'Ravi Tech', 'ravi@paytm', 'pending', 0, 0, 0, true),
('Fitness Coach Pro', '+919876540007', 'fitness@coach.com', 'Apartment 3C, Secunderabad', 17.4399, 78.4983, 7, 'Personal fitness trainer and yoga instructor', 'individual', 'GHIJK7890L', '7890123456789012', 'ICICI007890', 'Amit Fitness', 'amit@gpay', 'pending', 0, 0, 0, true)
ON CONFLICT (phone) DO NOTHING;

-- Sample Vendor Skills (link vendors to services)
INSERT INTO vendor_skills (vendor_id, service_id)
SELECT v.id, s.id
FROM vendors v, services s
WHERE (v.name = 'Rajesh Hair Studio' AND s.title LIKE '%Hair%')
   OR (v.name = 'Priya Wellness Spa' AND s.title LIKE '%Massage%')
   OR (v.name = 'Gourmet Kitchen Co' AND s.title LIKE '%Meal%')
   OR (v.name = 'Master Tailoring' AND s.title LIKE '%Tailor%')
ON CONFLICT DO NOTHING;

-- Sample Vendor Availability (Monday to Saturday, 9 AM to 6 PM)
INSERT INTO vendor_availability (vendor_id, day_of_week, start_time, end_time)
SELECT v.id, d.day, '09:00:00', '18:00:00'
FROM vendors v
CROSS JOIN (SELECT generate_series(1, 6) as day) d
WHERE v.verification_status = 'approved'
ON CONFLICT DO NOTHING;

-- Sample Orders
INSERT INTO orders (
  user_id, order_number, total_amount, service_fee, status, 
  scheduled_date, scheduled_time, address_id, assigned_vendor_id, 
  assignment_status, payment_method, payment_status
)
SELECT 
  u.id,
  'UG' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
  CASE 
    WHEN RANDOM() < 0.3 THEN 499
    WHEN RANDOM() < 0.6 THEN 799
    ELSE 1299
  END,
  49,
  CASE 
    WHEN RANDOM() < 0.2 THEN 'pending'
    WHEN RANDOM() < 0.4 THEN 'confirmed'
    WHEN RANDOM() < 0.7 THEN 'in_progress'
    ELSE 'completed'
  END,
  CURRENT_DATE + (RANDOM() * 7)::INTEGER,
  ('09:00:00'::TIME + (RANDOM() * INTERVAL '8 hours')),
  a.id,
  v.id,
  'assigned',
  CASE WHEN RANDOM() < 0.5 THEN 'upi' ELSE 'card' END,
  CASE WHEN RANDOM() < 0.8 THEN 'completed' ELSE 'pending' END
FROM users u
JOIN addresses a ON a.user_id = u.id AND a.is_default = true
CROSS JOIN (SELECT id FROM vendors WHERE verification_status = 'approved' ORDER BY RANDOM() LIMIT 1) v
WHERE u.phone LIKE '+91987654300%'
LIMIT 10;

-- Sample Order Items
INSERT INTO order_items (order_id, service_id, quantity, price)
SELECT 
  o.id,
  s.id,
  1,
  s.price
FROM orders o
CROSS JOIN (SELECT id, price FROM services ORDER BY RANDOM() LIMIT 1) s
WHERE o.order_number LIKE 'UG%';

-- Sample Order Assignments
INSERT INTO order_assignments (order_id, vendor_id, status)
SELECT 
  o.id,
  o.assigned_vendor_id,
  CASE 
    WHEN o.status = 'completed' THEN 'completed'
    WHEN o.status = 'in_progress' THEN 'started'
    WHEN o.status = 'confirmed' THEN 'accepted'
    ELSE 'assigned'
  END
FROM orders o
WHERE o.assigned_vendor_id IS NOT NULL;

-- Sample Reviews
INSERT INTO reviews (user_id, service_id, order_id, rating, comment)
SELECT 
  o.user_id,
  oi.service_id,
  o.id,
  (4 + RANDOM())::INTEGER,
  CASE 
    WHEN RANDOM() < 0.3 THEN 'Excellent service! Very professional and timely.'
    WHEN RANDOM() < 0.6 THEN 'Good quality work. Would recommend to others.'
    ELSE 'Satisfied with the service. Will book again.'
  END
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'completed'
LIMIT 15;

-- Admin Users (for demo purposes)
-- Note: In production, admin users should be created through proper auth flow
INSERT INTO users (id, phone, name, email, address, city, pincode) VALUES
(gen_random_uuid(), '+919876540000', 'Admin User', 'admin@urbangenie.com', 'UrbanGenie HQ, HITEC City', 'Hyderabad', '500081')
ON CONFLICT (phone) DO NOTHING;

-- Sample Agent/Support Users
INSERT INTO users (id, phone, name, email, address, city, pincode) VALUES
(gen_random_uuid(), '+919876549001', 'Support Agent 1', 'agent1@urbangenie.com', 'Support Center, Madhapur', 'Hyderabad', '500081'),
(gen_random_uuid(), '+919876549002', 'Support Agent 2', 'agent2@urbangenie.com', 'Support Center, Madhapur', 'Hyderabad', '500081')
ON CONFLICT (phone) DO NOTHING;

-- Update service ratings based on reviews
UPDATE services SET 
  rating = COALESCE((
    SELECT ROUND(AVG(rating::DECIMAL), 1)
    FROM reviews 
    WHERE reviews.service_id = services.id
  ), rating),
  total_reviews = COALESCE((
    SELECT COUNT(*)
    FROM reviews 
    WHERE reviews.service_id = services.id
  ), total_reviews);

-- Update vendor ratings based on completed orders
UPDATE vendors SET 
  rating = CASE 
    WHEN total_orders > 0 THEN 4.0 + (RANDOM() * 1.0)
    ELSE rating
  END,
  total_reviews = CASE 
    WHEN total_orders > 0 THEN (total_orders * 0.7)::INTEGER
    ELSE total_reviews
  END
WHERE verification_status = 'approved';