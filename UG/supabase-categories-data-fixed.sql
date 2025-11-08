-- Insert comprehensive service categories and subcategories
INSERT INTO categories (name, description, icon, gradient) 
SELECT * FROM (VALUES
  ('Beauty & Salon', 'Hair, makeup, spa & more at your doorstep', 'Sparkles', 'bg-gradient-to-br from-pink-500 to-purple-500'),
  ('Food & Beverages', 'Fresh meals, snacks & drinks delivered', 'Users', 'bg-gradient-to-br from-orange-500 to-red-500'),
  ('Wellness Services', 'Yoga, fitness & health at home', 'Shield', 'bg-gradient-to-br from-green-500 to-teal-500'),
  ('Clothing & Accessories', 'Tailoring, alterations & styling', 'Sparkles', 'bg-gradient-to-br from-blue-500 to-indigo-500'),
  ('Home Services', 'Cleaning, repairs & maintenance', 'Home', 'bg-gradient-to-br from-yellow-500 to-orange-500'),
  ('Electronics & Gadgets', 'Repair, installation & tech support', 'Zap', 'bg-gradient-to-br from-purple-500 to-pink-500'),
  ('Education & Training', 'Tutoring, coaching & skill development', 'BookOpen', 'bg-gradient-to-br from-indigo-500 to-blue-500'),
  ('Pet Services', 'Pet care, grooming & training', 'Heart', 'bg-gradient-to-br from-green-400 to-blue-500'),
  ('Event Services', 'Photography, decoration & planning', 'Camera', 'bg-gradient-to-br from-red-500 to-pink-500'),
  ('Transportation', 'Delivery, moving & logistics', 'Truck', 'bg-gradient-to-br from-gray-500 to-gray-700')
) AS v(name, description, icon, gradient)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.name = v.name);

-- Insert sample services with categories and subcategories
INSERT INTO services (category_id, title, category, subcategory, description, price, duration, image_url, rating, total_reviews, service_type)
SELECT * FROM (VALUES
  -- Beauty & Salon
  ((SELECT id FROM categories WHERE name = 'Beauty & Salon'), 'Hair Cut & Styling', 'Beauty & Salon', 'Hair Services', 'Professional haircut with styling', 499, '45 mins', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop', 4.8, 256, 'platform'),
  ((SELECT id FROM categories WHERE name = 'Beauty & Salon'), 'Hair Coloring', 'Beauty & Salon', 'Hair Services', 'Professional hair coloring service', 1299, '2 hours', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop', 4.7, 189, 'platform'),
  ((SELECT id FROM categories WHERE name = 'Beauty & Salon'), 'Facial Treatment', 'Beauty & Salon', 'Skincare', 'Deep cleansing facial treatment', 899, '60 mins', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop', 4.9, 142, 'platform'),
  ((SELECT id FROM categories WHERE name = 'Beauty & Salon'), 'Manicure & Pedicure', 'Beauty & Salon', 'Nail Care', 'Complete nail care service', 699, '90 mins', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop', 4.6, 98, 'platform'),
  
  -- Wellness Services
  ((SELECT id FROM categories WHERE name = 'Wellness Services'), 'Full Body Massage', 'Wellness Services', 'Massage Therapy', 'Relaxing Swedish massage therapy', 1299, '60 mins', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop', 4.9, 189, 'platform'),
  ((SELECT id FROM categories WHERE name = 'Wellness Services'), 'Yoga Session', 'Wellness Services', 'Fitness', 'Personal yoga training session', 799, '60 mins', 'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400&h=300&fit=crop', 4.8, 156, 'platform'),
  ((SELECT id FROM categories WHERE name = 'Wellness Services'), 'Physiotherapy', 'Wellness Services', 'Medical', 'Professional physiotherapy session', 999, '45 mins', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', 4.7, 134, 'platform'),
  
  -- Food & Beverages
  ((SELECT id FROM categories WHERE name = 'Food & Beverages'), 'Gourmet Meal Prep', 'Food & Beverages', 'Meal Services', 'Healthy chef-prepared meals', 799, '30 mins', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', 4.7, 142, 'platform'),
  ((SELECT id FROM categories WHERE name = 'Food & Beverages'), 'Birthday Cake', 'Food & Beverages', 'Bakery', 'Custom birthday cake delivery', 1299, '2 hours', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', 4.8, 89, 'vendor_product'),
  ((SELECT id FROM categories WHERE name = 'Food & Beverages'), 'Fresh Juice', 'Food & Beverages', 'Beverages', 'Fresh fruit juice delivery', 199, '15 mins', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop', 4.5, 67, 'vendor_product'),
  
  -- Home Services
  ((SELECT id FROM categories WHERE name = 'Home Services'), 'House Cleaning', 'Home Services', 'Cleaning', 'Deep cleaning service for homes', 899, '3 hours', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop', 4.5, 234, 'platform'),
  ((SELECT id FROM categories WHERE name = 'Home Services'), 'Plumbing Repair', 'Home Services', 'Repairs', 'Professional plumbing services', 499, '1 hour', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop', 4.6, 189, 'platform'),
  
  -- Electronics & Gadgets
  ((SELECT id FROM categories WHERE name = 'Electronics & Gadgets'), 'Mobile Repair', 'Electronics & Gadgets', 'Device Repair', 'Smartphone repair service', 799, '2 hours', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop', 4.4, 145, 'platform'),
  
  -- Education & Training
  ((SELECT id FROM categories WHERE name = 'Education & Training'), 'Math Tutoring', 'Education & Training', 'Academic', 'Personal math tutoring session', 599, '60 mins', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop', 4.8, 178, 'platform'),
  
  -- Pet Services
  ((SELECT id FROM categories WHERE name = 'Pet Services'), 'Dog Grooming', 'Pet Services', 'Grooming', 'Professional dog grooming service', 899, '2 hours', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', 4.6, 156, 'platform'),
  
  -- Event Services
  ((SELECT id FROM categories WHERE name = 'Event Services'), 'Photography', 'Event Services', 'Photography', 'Professional event photography', 2999, '4 hours', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop', 4.9, 234, 'platform'),
  
  -- Transportation
  ((SELECT id FROM categories WHERE name = 'Transportation'), 'Delivery Service', 'Transportation', 'Delivery', 'Same-day delivery service', 199, '1 hour', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop', 4.4, 345, 'platform')
) AS v(category_id, title, category, subcategory, description, price, duration, image_url, rating, total_reviews, service_type)
WHERE NOT EXISTS (SELECT 1 FROM services WHERE services.title = v.title);