-- Migration: Add music_url and custom_fields columns to invitations table
-- Run this migration to enable music and timeline features

-- Add music_url column for background music
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS music_url TEXT;

-- Add custom_fields column for storing timeline and other custom data
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS custom_fields JSONB;

-- Add hero_image_url column for hero section image/video
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Add views column for analytics (if not exists)
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add profiles table for user settings (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comment for documentation
COMMENT ON COLUMN invitations.music_url IS 'URL to background music file for the invitation';
COMMENT ON COLUMN invitations.custom_fields IS 'JSON object containing custom data like timeline events';
COMMENT ON COLUMN invitations.hero_image_url IS 'URL to hero section image or video';
COMMENT ON COLUMN invitations.views IS 'Number of times the invitation has been viewed';
