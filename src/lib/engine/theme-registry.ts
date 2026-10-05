import type { OpeningExperience, ThemeDefinition } from './contracts'

export const themeRegistry: Record<ThemeDefinition['id'], ThemeDefinition> = {
  default: {
    id: 'default',
    label: 'Default invitation',
    openingExperienceId: 'none',
    description: 'The existing invitation-builder renderer and RSVP flow.'
  },
  football: {
    id: 'football',
    label: 'Football',
    openingExperienceId: 'football-kick',
    description: 'A placeholder stadium-to-impact opening over the reusable shell.'
  }
}

export const openingExperienceRegistry: Record<OpeningExperience['id'], OpeningExperience> = {
  none: {
    id: 'none',
    label: 'No opening',
    mobileAssetBudgetKb: 0,
    supportsSkip: true,
    supportsReducedMotion: true
  },
  'football-kick': {
    id: 'football-kick',
    label: 'Football kick reveal',
    mobileAssetBudgetKb: 250,
    supportsSkip: true,
    supportsReducedMotion: true
  }
}
