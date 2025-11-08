-- Add payment and compliance fields to vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS business_type VARCHAR(20) DEFAULT 'individual' CHECK (business_type IN ('individual', 'shop', 'company'));
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS gstin VARCHAR(15);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS fssai_license VARCHAR(14);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pan_number VARCHAR(10);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(20);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(11);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS bank_account_holder_name VARCHAR(100);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS upi_id VARCHAR(50);

-- Create compliance documents table
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vendor_documents_vendor_id ON vendor_documents(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_documents_type ON vendor_documents(document_type);