'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import Link from 'next/link'
import { ExternalLink, Copy, Trash2, Globe, GlobeLock, Eye } from 'lucide-react'
import { publishInvitation, unpublishInvitation, deleteInvitation } from '@/lib/actions/invitations'
import { useState } from 'react'

interface InvitationActionsProps {
  invitation: {
    id: string
    slug: string
    status: string
    view_count: number
  }
  fullUrl: string
}

export function InvitationActions({ invitation, fullUrl }: InvitationActionsProps) {
  const [copied, setCopied] = useState(false)
  const invitationUrl = `/i/${invitation.slug}`

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge
            variant={invitation.status === 'published' ? 'default' : 'secondary'}
            className={invitation.status === 'published' ? 'bg-emerald-500' : ''}
          >
            {invitation.status === 'published' ? 'Yayında' : 'Taslak'}
          </Badge>
          <span className="text-sm text-slate-500">
            <Eye className="w-4 h-4 inline mr-1" />
            {invitation.view_count} görüntülenme
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {invitation.status === 'published' ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={invitationUrl} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Görüntüle
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
              </Button>
              <form action={unpublishInvitation.bind(null, invitation.id)}>
                <Button type="submit" variant="outline" size="sm">
                  <GlobeLock className="w-4 h-4 mr-2" />
                  Yayından Kaldır
                </Button>
              </form>
            </>
          ) : (
            <form action={publishInvitation.bind(null, invitation.id)}>
              <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Globe className="w-4 h-4 mr-2" />
                Yayınla
              </Button>
            </form>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Davetiyeyi Sil</DialogTitle>
                <DialogDescription>
                  Bu işlem geri alınamaz. Davetiye ve tüm RSVP yanıtları kalıcı olarak silinecektir.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <form action={deleteInvitation.bind(null, invitation.id)}>
                  <Button type="submit" variant="destructive">
                    Evet, Sil
                  </Button>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {invitation.status === 'published' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 mb-2">Davetiye Linki:</p>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <code className="flex-1 text-sm text-indigo-600 truncate">
              {fullUrl}
            </code>
            <Button variant="ghost" size="sm" onClick={copyLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
