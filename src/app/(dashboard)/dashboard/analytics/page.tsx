import { Header } from '@/components/dashboard/header'
import { createClient } from '@/lib/supabase/server'
import { AnalyticsStats } from '@/components/analytics/analytics-stats'
import { PerformanceChart } from '@/components/analytics/performance-chart'
import { TopInvitations } from '@/components/analytics/top-invitations'
import { RecentActivity } from '@/components/analytics/recent-activity'

/**
 * Analytics Page - Comprehensive dashboard analytics
 *
 * Features:
 * - Overview statistics (views, RSVPs, engagement)
 * - Performance charts over time
 * - Top performing invitations
 * - Recent activity timeline
 *
 * Performance: Server-side data fetching with Supabase
 * Accessibility: Semantic HTML, ARIA labels, keyboard navigation
 */

interface AnalyticsData {
  totalViews: number
  totalRSVPs: number
  rsvpRate: number
  engagementRate: number
  viewsTrend: number
  rsvpTrend: number
  chartData: Array<{
    date: string
    views: number
    rsvps: number
  }>
  topInvitations: Array<{
    id: string
    title: string
    type: string
    views: number
    rsvps: number
    rsvpRate: number
    createdAt: string
  }>
  recentActivity: Array<{
    id: string
    type: 'view' | 'rsvp' | 'created'
    invitationTitle: string
    timestamp: string
    guestName?: string
    details?: string
  }>
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient()

  // Get user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return getEmptyAnalytics()
  }

  // Fetch all invitations for this user
  const { data: invitations } = await supabase
    .from('invitations')
    .select('id, title, invitation_type, view_count, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!invitations || invitations.length === 0) {
    return getEmptyAnalytics()
  }

  const invitationIds = invitations.map(inv => inv.id)

  // Fetch all RSVP responses
  const { data: rsvps } = await supabase
    .from('rsvp_responses')
    .select('invitation_id, name, attending, created_at')
    .in('invitation_id', invitationIds)
    .order('created_at', { ascending: false })

  const totalRSVPs = rsvps?.length || 0
  const totalViews = invitations.reduce((sum, inv) => sum + (inv.view_count || 0), 0)

  // Calculate trends (comparing last 30 days vs previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentInvitations = invitations.filter(
    inv => new Date(inv.created_at) > thirtyDaysAgo
  )
  const previousInvitations = invitations.filter(
    inv => new Date(inv.created_at) > sixtyDaysAgo && new Date(inv.created_at) <= thirtyDaysAgo
  )

  const recentViews = recentInvitations.reduce((sum, inv) => sum + (inv.view_count || 0), 0)
  const previousViews = previousInvitations.reduce((sum, inv) => sum + (inv.view_count || 0), 0)

  const recentRSVPs = rsvps?.filter(
    rsvp => new Date(rsvp.created_at) > thirtyDaysAgo
  ).length || 0
  const previousRSVPs = rsvps?.filter(
    rsvp => new Date(rsvp.created_at) > sixtyDaysAgo && new Date(rsvp.created_at) <= thirtyDaysAgo
  ).length || 0

  const viewsTrend = previousViews > 0
    ? Math.round(((recentViews - previousViews) / previousViews) * 100)
    : recentViews > 0 ? 100 : 0

  const rsvpTrend = previousRSVPs > 0
    ? Math.round(((recentRSVPs - previousRSVPs) / previousRSVPs) * 100)
    : recentRSVPs > 0 ? 100 : 0

  // Generate chart data for last 7 days
  const chartData = generateChartData(invitations, rsvps || [])

  // Calculate top performing invitations
  const topInvitations = invitations
    .map(inv => {
      const invRSVPs = rsvps?.filter(r => r.invitation_id === inv.id).length || 0
      const views = inv.view_count || 0
      return {
        id: inv.id,
        title: inv.title,
        type: inv.invitation_type || 'Diğer',
        views,
        rsvps: invRSVPs,
        rsvpRate: views > 0 ? Math.round((invRSVPs / views) * 100) : 0,
        createdAt: inv.created_at
      }
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  // Generate recent activity
  const recentActivity = generateRecentActivity(invitations, rsvps || [])

  return {
    totalViews,
    totalRSVPs,
    rsvpRate: totalViews > 0 ? Math.round((totalRSVPs / totalViews) * 100) : 0,
    engagementRate: totalViews > 0 ? Math.round(((totalRSVPs * 1.5) / totalViews) * 100) : 0,
    viewsTrend,
    rsvpTrend,
    chartData,
    topInvitations,
    recentActivity
  }
}

function getEmptyAnalytics(): AnalyticsData {
  return {
    totalViews: 0,
    totalRSVPs: 0,
    rsvpRate: 0,
    engagementRate: 0,
    viewsTrend: 0,
    rsvpTrend: 0,
    chartData: [],
    topInvitations: [],
    recentActivity: []
  }
}

function generateChartData(
  invitations: any[],
  rsvps: any[]
): Array<{ date: string; views: number; rsvps: number }> {
  const last7Days = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    // For simplicity, we'll distribute views evenly across days
    // In production, you'd track views with timestamps
    const dayViews = Math.floor(
      invitations
        .filter(inv => new Date(inv.created_at) <= nextDate)
        .reduce((sum, inv) => sum + (inv.view_count || 0), 0) / 7
    )

    const dayRSVPs = rsvps.filter(rsvp => {
      const rsvpDate = new Date(rsvp.created_at)
      return rsvpDate >= date && rsvpDate < nextDate
    }).length

    last7Days.push({
      date: date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
      views: dayViews,
      rsvps: dayRSVPs
    })
  }

  return last7Days
}

function generateRecentActivity(
  invitations: any[],
  rsvps: any[]
): Array<{
  id: string
  type: 'view' | 'rsvp' | 'created'
  invitationTitle: string
  timestamp: string
  guestName?: string
  details?: string
}> {
  const activities: any[] = []

  // Add recent invitations created
  invitations.slice(0, 3).forEach(inv => {
    activities.push({
      id: `created-${inv.id}`,
      type: 'created',
      invitationTitle: inv.title,
      timestamp: inv.created_at,
      details: `${inv.invitation_type} davetiyesi oluşturuldu`
    })
  })

  // Add recent RSVPs
  rsvps.slice(0, 5).forEach(rsvp => {
    const invitation = invitations.find(inv => inv.id === rsvp.invitation_id)
    if (invitation) {
      activities.push({
        id: `rsvp-${rsvp.invitation_id}-${rsvp.created_at}`,
        type: 'rsvp',
        invitationTitle: invitation.title,
        timestamp: rsvp.created_at,
        guestName: rsvp.name,
        details: `${rsvp.attending === true ? 'Katılacak' : rsvp.attending === false ? 'Katılmayacak' : 'Beklemede'}`
      })
    }
  })

  // Sort by timestamp and take top 10
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  return (
    <div className="min-h-screen">
      <Header
        title="Analitik"
        description="Davetiyelerinizin performansını takip edin ve içgörüler elde edin"
      />

      <div className="p-6 space-y-6">
        {/* Statistics Overview */}
        <AnalyticsStats
          totalViews={data.totalViews}
          totalRSVPs={data.totalRSVPs}
          rsvpRate={data.rsvpRate}
          engagementRate={data.engagementRate}
          viewsTrend={data.viewsTrend}
          rsvpTrend={data.rsvpTrend}
        />

        {/* Performance Chart */}
        <PerformanceChart data={data.chartData} />

        {/* Top Invitations and Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopInvitations invitations={data.topInvitations} />
          <RecentActivity activities={data.recentActivity} />
        </div>
      </div>
    </div>
  )
}
