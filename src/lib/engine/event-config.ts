import type { Invitation } from '@/types/database'
import type { EventConfig, OpeningExperienceId, ThemeId } from './contracts'

type CustomFields = {
  age?: number | string
  celebrant_name?: string
  theme_id?: string
  opening_experience_id?: string
  timezone?: string
}

function readCustomFields(value: Invitation['custom_fields']): CustomFields {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as CustomFields
}

function readThemeId(value: string | undefined): ThemeId {
  return value === 'football' ? 'football' : 'default'
}

function readOpeningExperienceId(value: string | undefined, themeId: ThemeId): OpeningExperienceId {
  if (value === 'football-kick') return value
  return themeId === 'football' ? 'football-kick' : 'none'
}

export function toEventConfig(invitation: Invitation): EventConfig {
  const customFields = readCustomFields(invitation.custom_fields)
  const themeId = readThemeId(customFields.theme_id)
  const ageValue = Number(customFields.age)
  const age = Number.isFinite(ageValue) && ageValue > 0 ? ageValue : null

  return {
    id: invitation.id,
    slug: invitation.slug,
    category: invitation.invitation_type,
    title: invitation.title,
    subtitle: invitation.subtitle,
    message: invitation.message,
    celebrantName: customFields.celebrant_name || invitation.title,
    age,
    eventDate: invitation.event_date,
    eventTime: invitation.event_time,
    timezone: customFields.timezone || 'UTC',
    venueName: invitation.location_name,
    venueAddress: invitation.location_address,
    directionsUrl: invitation.location_map_url,
    showCountdown: invitation.show_countdown,
    showRsvp: invitation.show_rsvp,
    themeId,
    openingExperienceId: readOpeningExperienceId(customFields.opening_experience_id, themeId),
    primaryColor: invitation.primary_color,
    secondaryColor: invitation.secondary_color,
    accentColor: invitation.accent_color
  }
}
