import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getInvitationBySlug, getInvitationBySlugForMetadata } from '@/lib/data/invitations'
import { InvitationPage } from '@/components/invitation/invitation-page'
import { ElegantWeddingPage } from '@/components/invitation/elegant-wedding-page'
import { BirthdayPage } from '@/components/invitation/birthday-page'
import { GraduationPage } from '@/components/invitation/graduation-page'
import { BabyShowerPage } from '@/components/invitation/baby-shower-page'
import { CorporatePage } from '@/components/invitation/corporate-page'
import { InvitationEngine } from '@/components/invitation/invitation-engine'
import { toEventConfig } from '@/lib/engine/event-config'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  // Use the non-incrementing function for metadata to avoid double counting
  const invitation = await getInvitationBySlugForMetadata(slug)

  if (!invitation) {
    return {
      title: 'Davetiye Bulunamadı'
    }
  }

  return {
    title: `${invitation.title} | Davetiye`,
    description: invitation.message || `${invitation.title} - Sizi davet ediyoruz!`,
    openGraph: {
      title: invitation.title,
      description: invitation.message || `${invitation.title} - Sizi davet ediyoruz!`,
      type: 'website'
    }
  }
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const { slug } = await params
  const invitation = await getInvitationBySlug(slug)

  if (!invitation) {
    notFound()
  }

  const invitationConfig = toEventConfig(invitation)
  const invitationForShell = invitationConfig.openingExperienceId === 'football-kick'
    ? {
        ...invitation,
        custom_fields: {
          ...(invitation.custom_fields as Record<string, unknown> | null),
          entry_animation: 'none'
        }
      }
    : invitation

  // Keep the proven source renderer as an adapter behind the generic engine.
  const invitationShell = (() => {
    switch (invitationForShell.invitation_type) {
      // Elegant wedding template for wedding, engagement, anniversary
      case 'wedding':
      case 'engagement':
      case 'anniversary':
        return <ElegantWeddingPage invitation={invitationForShell} />

      // Birthday celebration template
      case 'birthday':
        return <BirthdayPage invitation={invitationForShell} />

      // Graduation ceremony template
      case 'graduation':
        return <GraduationPage invitation={invitationForShell} />

      // Baby shower template
      case 'baby_shower':
        return <BabyShowerPage invitation={invitationForShell} />

      // Corporate/professional events template
      case 'corporate':
      case 'party':
      case 'religious':
      case 'other':
        return <CorporatePage invitation={invitationForShell} />

      // Default fallback
      default:
        // If theme_style is 'elegant', use elegant template
        if (invitationForShell.theme_style === 'elegant') {
          return <ElegantWeddingPage invitation={invitationForShell} />
        }
        return <InvitationPage invitation={invitationForShell} />
    }
  })()

  return <InvitationEngine config={invitationConfig}>{invitationShell}</InvitationEngine>
}
