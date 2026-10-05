'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateSlug } from '@/lib/utils'
import {
  sendRSVPConfirmation,
  sendInvitationPublishedNotification,
  sendInvitationShareEmail,
  sendNewRSVPNotification
} from '@/lib/email/resend'

export async function createInvitation(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const slug = generateSlug(title)

  const invitation: Record<string, unknown> = {
    user_id: user.id,
    slug,
    title,
    subtitle: formData.get('subtitle') as string || null,
    message: formData.get('message') as string || null,
    event_date: formData.get('event_date') as string || null,
    event_time: formData.get('event_time') as string || null,
    location_name: formData.get('location_name') as string || null,
    location_address: formData.get('location_address') as string || null,
    location_map_url: formData.get('location_map_url') as string || null,
    invitation_type: formData.get('invitation_type') as string || 'party',
    theme_style: formData.get('theme_style') as string || 'modern',
    animation_type: formData.get('animation_type') as string || 'fade',
    primary_color: formData.get('primary_color') as string || '#6366f1',
    secondary_color: formData.get('secondary_color') as string || '#8b5cf6',
    accent_color: formData.get('accent_color') as string || '#ec4899',
    background_color: formData.get('background_color') as string || '#ffffff',
    text_color: formData.get('text_color') as string || '#1f2937',
    font_family: formData.get('font_family') as string || 'Inter',
    background_image_url: formData.get('background_image_url') as string || null,
    hero_image_url: formData.get('hero_image_url') as string || null,
    video_url: formData.get('video_url') as string || null,
    music_url: formData.get('music_url') as string || null,
    show_countdown: formData.get('show_countdown') === 'true',
    show_rsvp: formData.get('show_rsvp') === 'true',
    rsvp_deadline: formData.get('rsvp_deadline') as string || null,
    status: 'draft'
  }

  // Parse hosts array
  const hostsRaw = formData.get('hosts') as string
  if (hostsRaw) {
    try {
      invitation.hosts = JSON.parse(hostsRaw)
    } catch (e) {
      // If parsing fails, treat as comma-separated string
      invitation.hosts = hostsRaw.split(',').map((h: string) => h.trim()).filter(Boolean)
    }
  }

  // Parse custom_fields JSON
  const customFieldsRaw = formData.get('custom_fields') as string
  if (customFieldsRaw) {
    try {
      invitation.custom_fields = JSON.parse(customFieldsRaw)
    } catch (e) {
      console.error('Error parsing custom_fields:', e)
    }
  }

  const { data, error } = await supabase
    .from('invitations')
    .insert(invitation)
    .select()
    .single()

  if (error) {
    console.error('Error creating invitation:', error)
    throw new Error('Davetiye oluşturulamadı')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invitations')
  redirect(`/dashboard/invitations/${data.id}`)
}

export async function updateInvitation(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const updates: Record<string, unknown> = {
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string || null,
    message: formData.get('message') as string || null,
    event_date: formData.get('event_date') as string || null,
    event_time: formData.get('event_time') as string || null,
    location_name: formData.get('location_name') as string || null,
    location_address: formData.get('location_address') as string || null,
    location_map_url: formData.get('location_map_url') as string || null,
    invitation_type: formData.get('invitation_type') as string || 'party',
    theme_style: formData.get('theme_style') as string || 'modern',
    animation_type: formData.get('animation_type') as string || 'fade',
    primary_color: formData.get('primary_color') as string || '#6366f1',
    secondary_color: formData.get('secondary_color') as string || '#8b5cf6',
    accent_color: formData.get('accent_color') as string || '#ec4899',
    background_color: formData.get('background_color') as string || '#ffffff',
    text_color: formData.get('text_color') as string || '#1f2937',
    font_family: formData.get('font_family') as string || 'Inter',
    background_image_url: formData.get('background_image_url') as string || null,
    hero_image_url: formData.get('hero_image_url') as string || null,
    video_url: formData.get('video_url') as string || null,
    music_url: formData.get('music_url') as string || null,
    show_countdown: formData.get('show_countdown') === 'true',
    show_rsvp: formData.get('show_rsvp') === 'true',
    rsvp_deadline: formData.get('rsvp_deadline') as string || null,
    updated_at: new Date().toISOString()
  }

  // Update slug if provided
  const newSlug = formData.get('slug') as string
  if (newSlug && newSlug.trim()) {
    // Check slug uniqueness (excluding current invitation)
    const { data: existing } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', newSlug.trim())
      .neq('id', id)
      .single()

    if (existing) {
      throw new Error('Bu link zaten kullanımda. Lütfen farklı bir link seçin.')
    }
    updates.slug = newSlug.trim()
  }

  // Parse hosts array
  const hostsRaw = formData.get('hosts') as string
  if (hostsRaw) {
    try {
      updates.hosts = JSON.parse(hostsRaw)
    } catch (e) {
      updates.hosts = hostsRaw.split(',').map((h: string) => h.trim()).filter(Boolean)
    }
  }

  // Parse custom_fields JSON
  const customFieldsRaw = formData.get('custom_fields') as string
  if (customFieldsRaw) {
    try {
      updates.custom_fields = JSON.parse(customFieldsRaw)
    } catch (e) {
      console.error('Error parsing custom_fields:', e)
    }
  }

  const { error } = await supabase
    .from('invitations')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating invitation:', error)
    throw new Error('Davetiye güncellenemedi')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invitations')
  revalidatePath(`/dashboard/invitations/${id}`)
}

export async function publishInvitation(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get invitation details for email
  const { data: invitation } = await supabase
    .from('invitations')
    .select('title, slug')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  const { error } = await supabase
    .from('invitations')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error publishing invitation:', error)
    throw new Error('Davetiye yayınlanamadı')
  }

  // Send email notification to owner
  if (user.email && invitation) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanaldavetiye.com.tr'
    const invitationUrl = `${baseUrl}/i/${invitation.slug}`

    sendInvitationPublishedNotification({
      to: user.email,
      invitationTitle: invitation.title,
      invitationUrl
    }).catch(console.error) // Don't block on email send
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invitations')
  revalidatePath(`/dashboard/invitations/${id}`)
}

export async function unpublishInvitation(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('invitations')
    .update({
      status: 'draft',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error unpublishing invitation:', error)
    throw new Error('Davetiye yayından kaldırılamadı')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invitations')
  revalidatePath(`/dashboard/invitations/${id}`)
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting invitation:', error)
    throw new Error('Davetiye silinemedi')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/invitations')
  redirect('/dashboard/invitations')
}

export async function submitRSVP(invitationId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string || null
  const attending = formData.get('attending') === 'true'
  const guestCount = parseInt(formData.get('guest_count') as string) || 1
  const message = formData.get('message') as string || null

  const rsvp = {
    invitation_id: invitationId,
    name,
    email,
    phone: formData.get('phone') as string || null,
    attending,
    guest_count: guestCount,
    message,
    dietary_requirements: formData.get('dietary_requirements') as string || null
  }

  const { error } = await supabase
    .from('rsvp_responses')
    .insert(rsvp)

  if (error) {
    console.error('Error submitting RSVP:', error)
    throw new Error('RSVP gönderilemedi')
  }

  // Get invitation details for emails
  const { data: invitation } = await supabase
    .from('invitations')
    .select('title, event_date, event_time, location_name, user_id')
    .eq('id', invitationId)
    .single()

  if (invitation) {
    // Get invitation owner's email
    const { data: owner } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', invitation.user_id)
      .single()

    // If we couldn't get from profiles, try auth
    let ownerEmail = owner?.email
    if (!ownerEmail) {
      // Try to get email from auth.users through RPC or just skip
      // For now, we'll skip owner notification if profile doesn't have email
    }

    // Send confirmation to guest if they provided email
    if (email) {
      sendRSVPConfirmation({
        to: email,
        guestName: name,
        invitationTitle: invitation.title,
        eventDate: invitation.event_date,
        eventTime: invitation.event_time || undefined,
        locationName: invitation.location_name || undefined,
        attending
      }).catch(console.error)
    }

    // Send notification to invitation owner
    if (ownerEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanaldavetiye.com.tr'
      sendNewRSVPNotification({
        to: ownerEmail,
        invitationTitle: invitation.title,
        guestName: name,
        guestEmail: email || undefined,
        attending,
        guestCount: attending ? guestCount : undefined,
        message: message || undefined,
        dashboardUrl: `${baseUrl}/dashboard/responses`
      }).catch(console.error)
    }
  }

  return { success: true }
}

// Share invitation via email
export async function shareInvitationViaEmail(
  invitationId: string,
  recipientEmail: string,
  senderName: string,
  message?: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }

  // Get invitation
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('title, slug, status')
    .eq('id', invitationId)
    .eq('user_id', user.id)
    .single()

  if (error || !invitation) {
    throw new Error('Davetiye bulunamadı')
  }

  if (invitation.status !== 'published') {
    throw new Error('Sadece yayınlanmış davetiyeler paylaşılabilir')
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanaldavetiye.com.tr'
  const invitationUrl = `${baseUrl}/i/${invitation.slug}`

  const result = await sendInvitationShareEmail({
    to: recipientEmail,
    senderName,
    invitationTitle: invitation.title,
    invitationUrl,
    message
  })

  if (!result.success) {
    throw new Error('E-posta gönderilemedi')
  }

  return { success: true }
}
