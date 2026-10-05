'use client'

import { useMemo } from 'react'
import { Invitation } from '@/types/database'

// Import actual invitation page components
import { ElegantWeddingPage } from './elegant-wedding-page'
import { BirthdayPage } from './birthday-page'
import { GraduationPage } from './graduation-page'
import { BabyShowerPage } from './baby-shower-page'
import { CorporatePage } from './corporate-page'
import { InvitationPage } from './invitation-page'

interface PreviewData {
  title: string
  subtitle: string
  message: string
  event_date: string
  event_time: string
  location_name: string
  location_address: string
  location_map_url?: string
  invitation_type: string
  theme_style: string
  animation_type: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  font_family: string
  background_image_url: string
  hero_image_url?: string
  video_url?: string
  music_url?: string
  hosts?: string
  show_countdown: boolean
  show_rsvp: boolean
  // Type-specific fields
  age?: string | number
  baby_gender?: string
  baby_name?: string
  graduate_name?: string
  degree?: string
  school_name?: string
  company_name?: string
  event_type?: string
  dress_code?: string
  gift_registry_url?: string
  bride_name?: string
  groom_name?: string
}

interface InvitationPreviewProps {
  data: PreviewData
}

export function InvitationPreview({ data }: InvitationPreviewProps) {
  // Convert preview data to Invitation type for the actual components
  const invitation = useMemo<Invitation>(() => {
    // Parse hosts from comma-separated string
    const hostsArray = data.hosts
      ? data.hosts.split(',').map(h => h.trim()).filter(Boolean)
      : []

    // Build custom_fields based on invitation type
    const customFields: Record<string, any> = {}

    if (data.invitation_type === 'birthday' && data.age) {
      customFields.age = Number(data.age)
    }
    if (data.invitation_type === 'baby_shower') {
      customFields.baby_gender = data.baby_gender || 'surprise'
      customFields.baby_name = data.baby_name || ''
    }
    if (data.invitation_type === 'graduation') {
      customFields.graduate_name = data.graduate_name || ''
      customFields.degree = data.degree || ''
      customFields.school_name = data.school_name || ''
    }
    if (['wedding', 'engagement', 'anniversary'].includes(data.invitation_type)) {
      customFields.couple_names = {
        bride: data.bride_name || '',
        groom: data.groom_name || ''
      }
    }
    if (data.invitation_type === 'corporate') {
      customFields.company_name = data.company_name || ''
      customFields.event_type = data.event_type || ''
    }
    if (data.dress_code) customFields.dress_code = data.dress_code
    if (data.gift_registry_url) customFields.gift_registry_url = data.gift_registry_url

    return {
      id: 'preview',
      user_id: 'preview',
      slug: 'preview',
      title: data.title || 'Davetiye Başlığı',
      subtitle: data.subtitle || null,
      message: data.message || null,
      event_date: data.event_date || null,
      event_time: data.event_time || null,
      location_name: data.location_name || null,
      location_address: data.location_address || null,
      location_map_url: data.location_map_url || null,
      invitation_type: (data.invitation_type || 'party') as any,
      theme_style: (data.theme_style || 'modern') as any,
      animation_type: (data.animation_type || 'fade') as any,
      primary_color: data.primary_color || '#6366f1',
      secondary_color: data.secondary_color || '#8b5cf6',
      accent_color: data.accent_color || '#ec4899',
      background_color: data.background_color || '#ffffff',
      text_color: data.text_color || '#1f2937',
      font_family: data.font_family || 'Inter',
      background_image_url: data.background_image_url || null,
      hero_image_url: data.hero_image_url || null,
      video_url: data.video_url || null,
      music_url: data.music_url || null,
      hosts: hostsArray.length > 0 ? hostsArray : null,
      show_countdown: data.show_countdown ?? true,
      show_rsvp: data.show_rsvp ?? true,
      rsvp_deadline: null,
      custom_css: null,
      custom_fields: Object.keys(customFields).length > 0 ? customFields : null,
      status: 'draft' as any,
      view_count: 0,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }, [data])

  // Render the appropriate page component based on invitation type
  const renderPage = () => {
    switch (data.invitation_type) {
      case 'wedding':
      case 'engagement':
      case 'anniversary':
        return <ElegantWeddingPage invitation={invitation} />

      case 'birthday':
        return <BirthdayPage invitation={invitation} />

      case 'graduation':
        return <GraduationPage invitation={invitation} />

      case 'baby_shower':
        return <BabyShowerPage invitation={invitation} />

      case 'corporate':
      case 'party':
      case 'religious':
      case 'other':
        return <CorporatePage invitation={invitation} />

      default:
        if (data.theme_style === 'elegant') {
          return <ElegantWeddingPage invitation={invitation} />
        }
        return <InvitationPage invitation={invitation} />
    }
  }

  // Content rendered at 2x iPhone resolution, then scaled to 75%
  // This makes the phone 2x bigger without zooming in the content
  const phoneWidth = 860  // 2x of 430
  const phoneHeight = 1864 // 2x of 932
  const contentScale = 0.75 // Content at 75% (same visual density as before)

  // Final display size: ~685x1438
  const displayWidth = phoneWidth * contentScale + 40
  const displayHeight = phoneHeight * contentScale + 40

  return (
    <div className="w-full h-full relative flex items-start justify-center">
      {/* iPhone Pro Max Frame - Large */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`
        }}
      >
        {/* Phone outer frame - titanium color */}
        <div
          className="absolute inset-0 rounded-[3rem] shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            boxShadow: '0 35px 70px -15px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255,255,255,0.1) inset'
          }}
        />

        {/* Screen container with proper scaling */}
        <div
          className="absolute rounded-[2.6rem] overflow-hidden bg-black"
          style={{
            top: '16px',
            left: '16px',
            right: '16px',
            bottom: '16px',
          }}
        >
          {/* The actual screen content - rendered at 2x resolution then scaled to 75% */}
          <div
            style={{
              width: `${phoneWidth}px`,
              height: `${phoneHeight}px`,
              transform: `scale(${contentScale})`,
              transformOrigin: 'top left',
              overflow: 'hidden',
              borderRadius: '76px',
              background: '#fff'
            }}
          >
            {/* Dynamic Island - 2x size */}
            <div
              className="absolute z-50 bg-black rounded-full flex items-center justify-center"
              style={{
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '252px',
                height: '74px'
              }}
            >
              <div className="w-6 h-6 rounded-full bg-[#1a1a1a] mr-16" />
            </div>

            {/* Status bar - 2x size */}
            <div className="absolute top-0 left-0 right-0 h-[108px] z-40 flex items-end justify-between px-16 pb-2 pointer-events-none">
              <span className="text-[28px] font-semibold text-black">9:41</span>
              <div className="flex items-center gap-[10px]">
                <svg className="w-[36px] h-[36px] text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                </svg>
                <svg className="w-[36px] h-[36px] text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v18m-6.36-3.64l12.73-12.72M5.64 5.64l12.72 12.72"/>
                </svg>
                <div className="flex items-center">
                  <div className="w-[54px] h-[26px] border-[3px] border-black rounded-[8px] relative">
                    <div className="absolute inset-[4px] bg-black rounded-[4px]" style={{width: '80%'}} />
                  </div>
                  <div className="w-[4px] h-[12px] bg-black rounded-r-sm ml-[2px]" />
                </div>
              </div>
            </div>

            {/* Page content - scrollable */}
            <div
              className="absolute inset-0 overflow-y-auto overflow-x-hidden"
              style={{
                paddingTop: '108px',
                borderRadius: '76px'
              }}
            >
              {renderPage()}
            </div>

            {/* Home indicator - 2x size */}
            <div
              className="absolute bottom-[16px] left-1/2 -translate-x-1/2 w-[280px] h-[10px] bg-black rounded-full z-50"
            />
          </div>
        </div>
      </div>

      {/* Device label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <span className="text-[10px] text-slate-400 font-medium tracking-wide">
          iPhone 17 Pro Max
        </span>
      </div>
    </div>
  )
}
