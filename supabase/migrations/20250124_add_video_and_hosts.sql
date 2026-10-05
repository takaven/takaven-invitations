-- Add video_url, hosts, music_url, and custom_fields columns to invitations table
-- Run this migration in your Supabase SQL editor

ALTER TABLE invitations
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS hosts TEXT[],
ADD COLUMN IF NOT EXISTS music_url TEXT,
ADD COLUMN IF NOT EXISTS custom_fields JSONB;

-- Add comments for documentation
COMMENT ON COLUMN invitations.video_url IS 'URL to background video (YouTube, Vimeo, or direct link)';
COMMENT ON COLUMN invitations.hosts IS 'Array of host names for the event';
COMMENT ON COLUMN invitations.music_url IS 'URL to background music file';
COMMENT ON COLUMN invitations.custom_fields IS 'JSON object for type-specific fields (age, baby_gender, graduate_name, etc.)';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_invitations_invitation_type ON invitations(invitation_type);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
