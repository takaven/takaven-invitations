/**
 * User Preferences Type Definitions
 *
 * Centralized types for user settings and preferences
 * Used across settings page and related components
 */

/**
 * Theme preference options
 */
export type ThemePreference = 'light' | 'dark' | 'system'

/**
 * Notification preferences structure
 */
export interface NotificationPreferences {
  /** Core email notifications for invitation activities */
  emailNotifications: boolean

  /** Reminders for upcoming events */
  eventReminders: boolean

  /** Weekly summary digest */
  weeklyDigest: boolean

  /** Marketing and promotional emails */
  marketingEmails: boolean
}

/**
 * User profile information
 */
export interface UserProfile {
  /** User's email address */
  email: string

  /** Display name */
  name: string

  /** Avatar image URL (optional) */
  avatarUrl?: string

  /** User ID from Supabase */
  userId: string
}

/**
 * Complete user settings object
 */
export interface UserSettings {
  /** Profile information */
  profile: UserProfile

  /** Notification preferences */
  notifications: NotificationPreferences

  /** Theme preference */
  theme: ThemePreference

  /** API key (when feature is implemented) */
  apiKey?: string

  /** Account creation date */
  createdAt?: Date

  /** Last updated timestamp */
  updatedAt?: Date
}

/**
 * Settings update payload
 * Partial type for updating specific settings
 */
export type SettingsUpdate = Partial<Omit<UserSettings, 'profile'>>

/**
 * Default notification preferences
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  eventReminders: true,
  weeklyDigest: false,
  marketingEmails: false,
}

/**
 * Default theme preference
 */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light'
