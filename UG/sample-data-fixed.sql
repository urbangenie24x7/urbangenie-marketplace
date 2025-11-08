-- Sample Data for UrbanGenie Platform (Fixed)
-- This creates sample data without auth.users dependency

-- Sample Vendors (no foreign key dependency)
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
('Clean Home Services', '+919876540005', 'clean@home.com', 'Flat 101, Miyapur', 17.4948, 78.3563, 5, 'Professional home cleaning and maintenance', 'individual', 'EFGHI5678J', '5678901234567890', 'SBI0005678', 'Lakshmi Devi', 'lakshmi@gpay', 'approved', 4.5, 98, 200, true),
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

-- Demo Login Credentials Summary
-- Approved Vendors (Phone + Last 4 digits as password):
-- Rajesh Hair Studio: +919876540001 / Password: 0001
-- Priya Wellness Spa: +919876540002 / Password: 0002  
-- Gourmet Kitchen Co: +919876540003 / Password: 0003
-- Master Tailoring: +919876540004 / Password: 0004
-- Clean Home Services: +919876540005 / Password: 0005

-- Pending Vendors (for admin review):
-- Tech Repair Hub: +919876540006
-- Fitness Coach Pro: +919876540007