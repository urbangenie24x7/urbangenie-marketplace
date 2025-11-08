-- Insert subcategories data (run after subcategories table is created)

-- Beauty & Salon subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Beauty & Salon' LIMIT 1), 'Hair Services', 'Haircuts, styling, coloring');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Beauty & Salon' LIMIT 1), 'Skincare', 'Facials, treatments, cleansing');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Beauty & Salon' LIMIT 1), 'Nail Care', 'Manicure, pedicure, nail art');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Beauty & Salon' LIMIT 1), 'Makeup', 'Bridal, party, professional makeup');

-- Wellness Services subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Wellness Services' LIMIT 1), 'Fitness', 'Personal training, yoga, pilates');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Wellness Services' LIMIT 1), 'Medical', 'Physiotherapy, nursing, health checkups');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Wellness Services' LIMIT 1), 'Massage', 'Therapeutic, relaxation, sports massage');

-- Food & Beverages subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Food & Beverages' LIMIT 1), 'Bakery', 'Cakes, pastries, bread');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Food & Beverages' LIMIT 1), 'Beverages', 'Fresh juices, smoothies, drinks');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Food & Beverages' LIMIT 1), 'Catering', 'Event catering, bulk orders');

-- Home Services subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Home Services' LIMIT 1), 'Cleaning', 'House cleaning, deep cleaning');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Home Services' LIMIT 1), 'Repairs', 'Plumbing, electrical, carpentry');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Home Services' LIMIT 1), 'Maintenance', 'AC service, appliance repair');

-- Electronics & Gadgets subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 'Device Repair', 'Mobile, laptop, tablet repair');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 'Installation', 'TV mounting, setup services');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 'Tech Support', 'Software help, troubleshooting');

-- Education & Training subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Education & Training' LIMIT 1), 'Academic', 'School subjects, exam prep');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Education & Training' LIMIT 1), 'Skills', 'Language, music, art classes');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Education & Training' LIMIT 1), 'Professional', 'Career coaching, certifications');

-- Pet Services subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Pet Services' LIMIT 1), 'Grooming', 'Bathing, trimming, nail cutting');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Pet Services' LIMIT 1), 'Training', 'Obedience, behavior training');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Pet Services' LIMIT 1), 'Care', 'Pet sitting, walking, feeding');

-- Event Services subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Event Services' LIMIT 1), 'Photography', 'Wedding, event, portrait photography');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Event Services' LIMIT 1), 'Decoration', 'Party, wedding, corporate decor');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Event Services' LIMIT 1), 'Planning', 'Event coordination, management');

-- Transportation subcategories
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), 'Delivery', 'Package, food, document delivery');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), 'Moving', 'Home shifting, furniture moving');
INSERT INTO subcategories (category_id, name, description) VALUES ((SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), 'Logistics', 'Bulk transport, warehousing');