export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type InvitationType =
  | 'wedding'
  | 'birthday'
  | 'graduation'
  | 'baby_shower'
  | 'engagement'
  | 'anniversary'
  | 'corporate'
  | 'party'
  | 'religious'
  | 'other'

export type AnimationType =
  | 'fade'
  | 'slide_up'
  | 'slide_down'
  | 'slide_left'
  | 'slide_right'
  | 'zoom'
  | 'rotate'
  | 'bounce'
  | 'flip'
  | 'confetti'
  | 'sparkle'
  | 'elegant'
  | 'none'

export type ThemeStyle =
  | 'classic'
  | 'modern'
  | 'elegant'
  | 'romantic'
  | 'playful'
  | 'minimal'
  | 'rustic'
  | 'luxury'
  | 'vintage'
  | 'tropical'

export type InvitationStatus = 'draft' | 'published' | 'archived'

export interface Database {
  public: {
    Tables: {
      invitations: {
        Row: {
          id: string
          user_id: string
          slug: string
          title: string
          subtitle: string | null
          message: string | null
          event_date: string | null
          event_time: string | null
          location_name: string | null
          location_address: string | null
          location_map_url: string | null
          invitation_type: InvitationType
          theme_style: ThemeStyle
          animation_type: AnimationType
          primary_color: string
          secondary_color: string
          accent_color: string
          background_color: string
          text_color: string
          font_family: string
          background_image_url: string | null
          hero_image_url: string | null
          video_url: string | null
          music_url: string | null
          hosts: string[] | null
          show_countdown: boolean
          show_rsvp: boolean
          rsvp_deadline: string | null
          custom_css: string | null
          custom_fields: Json | null
          status: InvitationStatus
          view_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          title: string
          subtitle?: string | null
          message?: string | null
          event_date?: string | null
          event_time?: string | null
          location_name?: string | null
          location_address?: string | null
          location_map_url?: string | null
          invitation_type?: InvitationType
          theme_style?: ThemeStyle
          animation_type?: AnimationType
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          background_color?: string
          text_color?: string
          font_family?: string
          background_image_url?: string | null
          hero_image_url?: string | null
          video_url?: string | null
          music_url?: string | null
          hosts?: string[] | null
          show_countdown?: boolean
          show_rsvp?: boolean
          rsvp_deadline?: string | null
          custom_css?: string | null
          custom_fields?: Json | null
          status?: InvitationStatus
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          message?: string | null
          event_date?: string | null
          event_time?: string | null
          location_name?: string | null
          location_address?: string | null
          location_map_url?: string | null
          invitation_type?: InvitationType
          theme_style?: ThemeStyle
          animation_type?: AnimationType
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          background_color?: string
          text_color?: string
          font_family?: string
          background_image_url?: string | null
          hero_image_url?: string | null
          video_url?: string | null
          music_url?: string | null
          hosts?: string[] | null
          show_countdown?: boolean
          show_rsvp?: boolean
          rsvp_deadline?: string | null
          custom_css?: string | null
          custom_fields?: Json | null
          status?: InvitationStatus
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rsvp_responses: {
        Row: {
          id: string
          invitation_id: string
          name: string
          email: string | null
          phone: string | null
          attending: boolean
          guest_count: number
          message: string | null
          dietary_requirements: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          name: string
          email?: string | null
          phone?: string | null
          attending?: boolean
          guest_count?: number
          message?: string | null
          dietary_requirements?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          attending?: boolean
          guest_count?: number
          message?: string | null
          dietary_requirements?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      invitation_type: InvitationType
      animation_type: AnimationType
      theme_style: ThemeStyle
      invitation_status: InvitationStatus
    }
  }
}

export type Invitation = Database['public']['Tables']['invitations']['Row']
export type InvitationInsert = Database['public']['Tables']['invitations']['Insert']
export type InvitationUpdate = Database['public']['Tables']['invitations']['Update']
export type RSVPResponse = Database['public']['Tables']['rsvp_responses']['Row']
export type RSVPResponseInsert = Database['public']['Tables']['rsvp_responses']['Insert']
