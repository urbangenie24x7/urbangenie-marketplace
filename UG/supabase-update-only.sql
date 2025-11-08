-- Update existing vendors table with compliance fields
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS business_type VARCHAR(20) DEFAULT 'individual' CHECK (business_type IN ('individual', 'shop', 'company'));
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS gstin VARCHAR(15);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS fssai_license VARCHAR(14);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pan_number VARCHAR(10);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(20);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(11);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS bank_account_holder_name VARCHAR(100);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS upi_id VARCHAR(50);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Create vendor documents table
CREATE TABLE IF NOT EXISTS vendor_documents (
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

-- Add missing columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE services ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);

-- Update existing services with category/subcategory data
UPDATE services SET 
  category = CASE 
    WHEN title LIKE '%Hair%' THEN 'Beauty & Salon'
    WHEN title LIKE '%Massage%' THEN 'Wellness Services'
    WHEN title LIKE '%Meal%' OR title LIKE '%Food%' THEN 'Food & Beverages'
    WHEN title LIKE '%Tailor%' THEN 'Clothing & Accessories'
    ELSE 'General Services'
  END,
  subcategory = CASE 
    WHEN title LIKE '%Hair%' THEN 'Hair Services'
    WHEN title LIKE '%Massage%' THEN 'Massage Therapy'
    WHEN title LIKE '%Meal%' OR title LIKE '%Food%' THEN 'Meal Services'
    WHEN title LIKE '%Tailor%' THEN 'Tailoring Services'
    ELSE 'General'
  END
WHERE category IS NULL OR subcategory IS NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendor_documents_vendor_id ON vendor_documents(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_documents_type ON vendor_documents(document_type);

-- Enable RLS for new table
ALTER TABLE vendor_documents ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for vendor applications
CREATE POLICY IF NOT EXISTS "Anyone can insert vendor applications" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can view vendor skills" ON vendor_skills FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can insert vendor skills" ON vendor_skills FOR INSERT WITH CHECK (true);