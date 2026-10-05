import { Header } from '@/components/dashboard/header'
import { StatCard } from '@/components/dashboard/stat-card'
import { ResponsesTable } from '@/components/dashboard/responses-table'
import { ResponsesFilters } from '@/components/dashboard/responses-filters'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Download, Users, UserCheck, UserX, Clock } from 'lucide-react'

interface RsvpResponse {
  id: string
  name: string
  email: string | null
  phone: string | null
  attending: boolean | null
  guest_count: number
  message: string | null
  created_at: string
  invitation_id: string
  invitations: {
    title: string
    event_date: string | null
  }
}

interface PageProps {
  searchParams: Promise<{
    invitation?: string
    status?: string
    from?: string
    to?: string
  }>
}

async function getResponses(filters: {
  invitation?: string
  status?: string
  from?: string
  to?: string
}) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // First get user's invitation IDs
  const { data: userInvitations } = await supabase
    .from('invitations')
    .select('id')
    .eq('user_id', user.id)

  if (!userInvitations || userInvitations.length === 0) return []

  const invitationIds = userInvitations.map(inv => inv.id)

  let query = supabase
    .from('rsvp_responses')
    .select(`
      *,
      invitations (
        title,
        event_date
      )
    `)
    .in('invitation_id', invitationIds)
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters.invitation) {
    query = query.eq('invitation_id', filters.invitation)
  }

  if (filters.status === 'attending') {
    query = query.eq('attending', true)
  } else if (filters.status === 'declined') {
    query = query.eq('attending', false)
  } else if (filters.status === 'pending') {
    query = query.is('attending', null)
  }

  if (filters.from) {
    query = query.gte('created_at', filters.from)
  }

  if (filters.to) {
    query = query.lte('created_at', filters.to)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching responses:', error)
    return []
  }

  return (data as RsvpResponse[]) || []
}

async function getInvitations() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('invitations')
    .select('id, title')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching invitations:', error)
    return []
  }

  return data || []
}

async function getResponseStats(responses: RsvpResponse[]) {
  const total = responses.length
  const attending = responses.filter((r) => r.attending === true).length
  const declined = responses.filter((r) => r.attending === false).length
  const pending = responses.filter((r) => r.attending === null).length
  const totalGuests = responses
    .filter((r) => r.attending === true)
    .reduce((sum, r) => sum + r.guest_count, 0)

  return {
    total,
    attending,
    declined,
    pending,
    totalGuests,
  }
}

export default async function ResponsesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const [responses, invitations] = await Promise.all([
    getResponses(params),
    getInvitations(),
  ])

  const stats = await getResponseStats(responses)

  return (
    <div className="min-h-screen">
      <Header
        title="RSVP Yanıtları"
        description="Davetiye yanıtlarınızı görüntüleyin ve yönetin"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Toplam Yanıt"
            value={stats.total}
            iconName="mail"
            color="indigo"
            delay={0}
          />
          <StatCard
            title="Katılacak"
            value={stats.attending}
            iconName="fileCheck"
            color="emerald"
            delay={0.1}
          />
          <StatCard
            title="Katılamayacak"
            value={stats.declined}
            iconName="filePlus"
            color="pink"
            delay={0.2}
          />
          <StatCard
            title="Toplam Misafir"
            value={stats.totalGuests}
            iconName="eye"
            color="purple"
            delay={0.3}
          />
        </div>

        {/* Filters and Export */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <ResponsesFilters invitations={invitations} />

          <Button
            variant="outline"
            className="shrink-0 border-slate-200 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
        </div>

        {/* Responses Table */}
        <ResponsesTable responses={responses} />
      </div>
    </div>
  )
}
