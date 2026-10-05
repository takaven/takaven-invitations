'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Invitation } from '@/types/database'
import {
  Calendar,
  MapPin,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Copy
} from 'lucide-react'

interface InvitationCardProps {
  invitation: Invitation
  index?: number
}

const typeLabels: Record<string, string> = {
  wedding: 'Düğün',
  birthday: 'Doğum Günü',
  graduation: 'Mezuniyet',
  baby_shower: 'Baby Shower',
  engagement: 'Nişan',
  anniversary: 'Yıldönümü',
  corporate: 'Kurumsal',
  party: 'Parti',
  religious: 'Dini',
  other: 'Diğer'
}

const themeColors: Record<string, string> = {
  classic: 'from-amber-400 to-orange-500',
  modern: 'from-slate-600 to-slate-800',
  elegant: 'from-purple-500 to-indigo-600',
  romantic: 'from-pink-400 to-rose-500',
  playful: 'from-cyan-400 to-blue-500',
  minimal: 'from-gray-300 to-gray-500',
  rustic: 'from-amber-600 to-yellow-700',
  luxury: 'from-yellow-400 to-amber-500',
  vintage: 'from-rose-300 to-pink-400',
  tropical: 'from-emerald-400 to-teal-500'
}

export function InvitationCard({ invitation, index = 0 }: InvitationCardProps) {
  const invitationUrl = `/i/${invitation.slug}`

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${invitationUrl}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
    >
      {/* Header with gradient */}
      <div className={cn(
        'h-32 relative bg-gradient-to-br',
        themeColors[invitation.theme_style] || 'from-indigo-500 to-purple-600'
      )}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white truncate">{invitation.title}</h3>
          {invitation.subtitle && (
            <p className="text-sm text-white/80 truncate mt-0.5">{invitation.subtitle}</p>
          )}
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Badge
            variant={invitation.status === 'published' ? 'default' : 'secondary'}
            className={cn(
              invitation.status === 'published'
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-slate-500 hover:bg-slate-600'
            )}
          >
            {invitation.status === 'published' ? 'Yayında' : 'Taslak'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Badge variant="outline" className="font-normal">
            {typeLabels[invitation.invitation_type]}
          </Badge>
        </div>

        <div className="space-y-2">
          {invitation.event_date && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
                {invitation.event_time && ` - ${invitation.event_time}`}
              </span>
            </div>
          )}
          {invitation.location_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{invitation.location_name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Eye className="w-4 h-4" />
            <span>{invitation.view_count} görüntülenme</span>
          </div>

          <div className="flex items-center gap-1">
            {invitation.status === 'published' && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={invitationUrl} target="_blank">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/invitations/${invitation.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Link>
                </DropdownMenuItem>
                {invitation.status === 'published' && (
                  <>
                    <DropdownMenuItem onClick={copyLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Linki Kopyala
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={invitationUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Görüntüle
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
