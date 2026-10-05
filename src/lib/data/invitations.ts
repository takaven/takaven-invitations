import { createClient } from '@/lib/supabase/server'
import { Invitation, InvitationInsert, InvitationUpdate } from '@/types/database'
import { demoFootballInvitation } from './demo-invitation'

const isDemoMode = process.env.TAKAVEN_DEMO_MODE === 'true'

export async function getInvitations(): Promise<Invitation[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching invitations:', error)
    return []
  }

  return data || []
}

export async function getInvitation(id: string): Promise<Invitation | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching invitation:', error)
    return null
  }

  return data
}

// Fetch invitation by slug without incrementing view count (for metadata)
export async function getInvitationBySlugForMetadata(slug: string): Promise<Invitation | null> {
  if (isDemoMode && slug === demoFootballInvitation.slug) return demoFootballInvitation

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching invitation by slug:', error)
    return null
  }

  return data
}

// Fetch invitation by slug and increment view count (for page render)
export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  if (isDemoMode && slug === demoFootballInvitation.slug) return demoFootballInvitation

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching invitation by slug:', error)
    return null
  }

  // Increment view count atomically using RPC function
  if (data) {
    await supabase.rpc('increment_view_count', { invitation_slug: slug })
  }

  return data
}

export async function getInvitationStats() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { total: 0, published: 0, draft: 0, totalViews: 0 }

  const { data, error } = await supabase
    .from('invitations')
    .select('status, view_count')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching stats:', error)
    return { total: 0, published: 0, draft: 0, totalViews: 0 }
  }

  return {
    total: data.length,
    published: data.filter(i => i.status === 'published').length,
    draft: data.filter(i => i.status === 'draft').length,
    totalViews: data.reduce((sum, i) => sum + i.view_count, 0)
  }
}

export async function getRSVPResponses(invitationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rsvp_responses')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching RSVP responses:', error)
    return []
  }

  return data || []
}
