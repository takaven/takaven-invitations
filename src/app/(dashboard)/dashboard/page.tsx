import { Header } from '@/components/dashboard/header'
import { StatCard } from '@/components/dashboard/stat-card'
import { InvitationCard } from '@/components/dashboard/invitation-card'
import { getInvitations, getInvitationStats } from '@/lib/data/invitations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Plus, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const [invitations, stats] = await Promise.all([
    getInvitations(),
    getInvitationStats()
  ])

  const recentInvitations = invitations.slice(0, 4)

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        description="Davetiyelerinizi yönetin ve istatistikleri görüntüleyin"
      />

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Toplam Davetiye"
            value={stats.total}
            iconName="mail"
            color="indigo"
            delay={0}
          />
          <StatCard
            title="Yayında"
            value={stats.published}
            iconName="fileCheck"
            color="emerald"
            delay={0.1}
          />
          <StatCard
            title="Taslak"
            value={stats.draft}
            iconName="filePlus"
            color="amber"
            delay={0.2}
          />
          <StatCard
            title="Toplam Görüntülenme"
            value={stats.totalViews}
            iconName="eye"
            color="purple"
            delay={0.3}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Yeni Bir Davetiye Oluşturun</h2>
              <p className="text-indigo-100 mt-1">
                Düğün, doğum günü veya özel etkinlikleriniz için güzel davetiyeler tasarlayın.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="shrink-0">
              <Link href="/dashboard/create">
                <Plus className="w-5 h-5 mr-2" />
                Davetiye Oluştur
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Invitations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Son Davetiyeler</h2>
            {invitations.length > 4 && (
              <Button variant="ghost" asChild>
                <Link href="/dashboard/invitations">
                  Tümünü Gör
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>

          {recentInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {recentInvitations.map((invitation, index) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Henüz davetiye oluşturmadınız
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                İlk davetiyenizi oluşturarak özel günlerinizi kutlamaya başlayın.
              </p>
              <Button asChild>
                <Link href="/dashboard/create">
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Davetiyenizi Oluşturun
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
