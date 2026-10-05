import { Header } from '@/components/dashboard/header'
import { InvitationForm } from '@/components/invitation/invitation-form'

export default function CreateInvitationPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Yeni Davetiye Oluştur"
        description="Özel gününüz için güzel bir davetiye tasarlayın"
      />

      <div className="p-6">
        <InvitationForm />
      </div>
    </div>
  )
}
