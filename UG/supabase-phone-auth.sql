-- Enable phone authentication in Supabase
-- Run this in your Supabase SQL Editor

-- Update users table to handle phone auth
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- Create policy for phone auth users
CREATE POLICY "Phone auth users can insert" ON public.users 
FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user creation from phone auth
CREATE OR REPLACE FUNCTION public.handle_new_phone_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone, phone_verified, created_at)
  VALUES (
    NEW.id,
    NEW.phone,
    NEW.phone_confirmed_at IS NOT NULL,
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    phone_verified = EXCLUDED.phone_verified;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new phone auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_phone_user();