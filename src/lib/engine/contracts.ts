import type { Invitation, InvitationType } from '@/types/database'

export type ThemeId = 'default' | 'football'
export type OpeningExperienceId = 'none' | 'football-kick'

export interface EventConfig {
  id: string
  slug: string
  category: InvitationType
  title: string
  subtitle: string | null
  message: string | null
  celebrantName: string
  age: number | null
  eventDate: string | null
  eventTime: string | null
  timezone: string
  venueName: string | null
  venueAddress: string | null
  directionsUrl: string | null
  showCountdown: boolean
  showRsvp: boolean
  themeId: ThemeId
  openingExperienceId: OpeningExperienceId
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export interface ThemeDefinition {
  id: ThemeId
  label: string
  openingExperienceId: OpeningExperienceId
  description: string
}

/**
 * The intentionally small Phase 1 contract. Rendering stays in a client
 * adapter so existing invitation pages and RSVP code remain untouched.
 */
export interface OpeningExperience {
  id: OpeningExperienceId
  label: string
  mobileAssetBudgetKb: number
  supportsSkip: boolean
  supportsReducedMotion: boolean
}

export interface InvitationEngineProps {
  config: EventConfig
  invitation: Invitation
}
