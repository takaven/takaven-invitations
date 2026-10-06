-- Phase 1.1: enforce the RSVP-disabled state at the database boundary.
DROP POLICY IF EXISTS "Anyone can submit RSVP to published invitations" ON rsvp_responses;

CREATE POLICY "Anyone can submit RSVP to published invitations"
ON rsvp_responses FOR INSERT
TO anon, authenticated
WITH CHECK (
  invitation_id IN (
    SELECT id
    FROM invitations
    WHERE status = 'published'
      AND show_rsvp = true
  )
);
