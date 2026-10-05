import { Header } from '@/components/dashboard/header'
import { InvitationCard } from '@/components/dashboard/invitation-card'
import { getInvitations } from '@/lib/data/invitations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Mail } from 'lucide-react'

export default async function InvitationsPage() {
  const invitations = await getInvitations()

  return (
    <div className="min-h-screen">
      <Header
        title="Davetiyelerim"
        description="Tüm davetiyelerinizi görüntüleyin ve yönetin"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-600">
              Toplam {invitations.length} davetiye
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Davetiye
            </Link>
          </Button>
        </div>

        {invitations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {invitations.map((invitation, index) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">
              Henüz davetiye oluşturmadınız
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Düğün, doğum günü, mezuniyet veya diğer özel günleriniz için
              profesyonel davetiyeler oluşturun.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard/create">
                <Plus className="w-5 h-5 mr-2" />
                İlk Davetiyenizi Oluşturun
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
