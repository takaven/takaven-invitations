import { notFound } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { InvitationForm } from '@/components/invitation/invitation-form'
import { InvitationActions } from '@/components/dashboard/invitation-actions'
import { getInvitation } from '@/lib/data/invitations'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditInvitationPage({ params }: PageProps) {
  const { id } = await params
  const invitation = await getInvitation(id)

  if (!invitation) {
    notFound()
  }

  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/i/${invitation.slug}`

  return (
    <div className="min-h-screen">
      <Header
        title="Davetiyeyi Düzenle"
        description={invitation.title}
      />

      <div className="p-6">
        <InvitationActions
          invitation={{
            id: invitation.id,
            slug: invitation.slug,
            status: invitation.status,
            view_count: invitation.view_count
          }}
          fullUrl={fullUrl}
        />

        <InvitationForm invitation={invitation} />
      </div>
    </div>
  )
}
