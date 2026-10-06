-- Invitation Builder Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE invitation_type AS ENUM (
  'wedding',
  'birthday',
  'graduation',
  'baby_shower',
  'engagement',
  'anniversary',
  'corporate',
  'party',
  'religious',
  'other'
);

CREATE TYPE animation_type AS ENUM (
  'fade',
  'slide_up',
  'slide_down',
  'slide_left',
  'slide_right',
  'zoom',
  'rotate',
  'bounce',
  'flip',
  'confetti',
  'sparkle',
  'elegant',
  'none'
);

CREATE TYPE theme_style AS ENUM (
  'classic',
  'modern',
  'elegant',
  'romantic',
  'playful',
  'minimal',
  'rustic',
  'luxury',
  'vintage',
  'tropical'
);

CREATE TYPE invitation_status AS ENUM (
  'draft',
  'published',
  'archived'
);

-- Create invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  message TEXT,
  event_date DATE,
  event_time TIME,
  location_name TEXT,
  location_address TEXT,
  location_map_url TEXT,
  invitation_type invitation_type DEFAULT 'party',
  theme_style theme_style DEFAULT 'modern',
  animation_type animation_type DEFAULT 'fade',
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#8b5cf6',
  accent_color TEXT DEFAULT '#ec4899',
  background_color TEXT DEFAULT '#ffffff',
  text_color TEXT DEFAULT '#1f2937',
  font_family TEXT DEFAULT 'Inter',
  background_image_url TEXT,
  hero_image_url TEXT,
  music_url TEXT,
  show_countdown BOOLEAN DEFAULT true,
  show_rsvp BOOLEAN DEFAULT true,
  rsvp_deadline DATE,
  custom_css TEXT,
  custom_fields JSONB,
  status invitation_status DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RSVP responses table
CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN DEFAULT true,
  guest_count INTEGER DEFAULT 1,
  message TEXT,
  dietary_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_invitations_slug ON invitations(slug);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_invitations_created_at ON invitations(created_at DESC);
CREATE INDEX idx_rsvp_invitation_id ON rsvp_responses(invitation_id);
CREATE INDEX idx_rsvp_created_at ON rsvp_responses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations table

-- Users can view their own invitations
CREATE POLICY "Users can view own invitations"
ON invitations FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Anyone can view published invitations (for public access)
CREATE POLICY "Anyone can view published invitations"
ON invitations FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Users can create their own invitations
CREATE POLICY "Users can create own invitations"
ON invitations FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can update their own invitations
CREATE POLICY "Users can update own invitations"
ON invitations FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can delete their own invitations
CREATE POLICY "Users can delete own invitations"
ON invitations FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- RLS Policies for rsvp_responses table

-- Invitation owners can view RSVP responses
CREATE POLICY "Invitation owners can view responses"
ON rsvp_responses FOR SELECT
TO authenticated
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = (SELECT auth.uid())
  )
);

-- Anyone can submit RSVP to published invitations with RSVP enabled
CREATE POLICY "Anyone can submit RSVP to published invitations"
ON rsvp_responses FOR INSERT
TO anon, authenticated
WITH CHECK (
  invitation_id IN (
    SELECT id FROM invitations WHERE status = 'published' AND show_rsvp = true
  )
);

-- Invitation owners can delete RSVP responses
CREATE POLICY "Invitation owners can delete responses"
ON rsvp_responses FOR DELETE
TO authenticated
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = (SELECT auth.uid())
  )
);

-- Function to update view count (bypasses RLS)
CREATE OR REPLACE FUNCTION increment_view_count(invitation_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE invitations
  SET view_count = view_count + 1
  WHERE slug = invitation_slug AND status = 'published';
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant execute permission on the view count function
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO anon, authenticated;
