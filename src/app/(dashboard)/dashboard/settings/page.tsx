import { Header } from '@/components/dashboard/header'
import { SettingsContent } from '@/components/dashboard/settings-content'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * User Settings Page
 *
 * Features:
 * - Profile information display
 * - Notification preferences
 * - Theme settings (placeholder)
 * - Account management actions
 * - API key management (placeholder)
 *
 * Uses Framer Motion for smooth section animations
 * Follows dashboard design patterns with Card components
 */
export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get user metadata
  const userEmail = user.email || ''
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="min-h-screen">
      <Header
        title="Ayarlar"
        description="Hesap ayarlarınızı ve tercihlerinizi yönetin"
      />

      <SettingsContent
        userEmail={userEmail}
        userName={userName}
        avatarUrl={avatarUrl}
        userId={user.id}
      />
    </div>
  )
}
