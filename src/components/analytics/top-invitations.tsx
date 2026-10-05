'use client'

import { motion } from 'framer-motion'
import { Trophy, Eye, UserCheck, TrendingUp, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

/**
 * TopInvitations Component - Shows top performing invitations
 *
 * Features:
 * - Ranked list of best performing invitations
 * - Visual metrics (views, RSVPs, conversion rate)
 * - Trophy badges for top 3
 * - Clickable links to invitation details
 * - Empty state handling
 *
 * Props:
 * @param invitations - Array of invitation performance data
 *
 * Usage:
 * <TopInvitations invitations={topInvitationsList} />
 */

interface Invitation {
  id: string
  title: string
  type: string
  views: number
  rsvps: number
  rsvpRate: number
  createdAt: string
}

interface TopInvitationsProps {
  invitations: Invitation[]
}

const rankColors = {
  0: 'from-amber-400 to-amber-500', // Gold
  1: 'from-slate-300 to-slate-400', // Silver
  2: 'from-orange-400 to-orange-500' // Bronze
}

const typeColors: Record<string, string> = {
  'Düğün': 'bg-pink-100 text-pink-700',
  'Doğum Günü': 'bg-purple-100 text-purple-700',
  'Nişan': 'bg-rose-100 text-rose-700',
  'Mezuniyet': 'bg-blue-100 text-blue-700',
  'Diğer': 'bg-slate-100 text-slate-700'
}

export function TopInvitations({ invitations }: TopInvitationsProps) {
  if (invitations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          En Başarılı Davetiyeler
        </h2>
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Henüz veri yok
          </h3>
          <p className="text-slate-500">
            Davetiyeleriniz görüntülenmeye başladığında burada sıralama göreceksiniz.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      role="region"
      aria-label="En başarılı davetiyeler listesi"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            En Başarılı Davetiyeler
          </h2>
          <p className="text-sm text-slate-500">En çok görüntülenen ilk 5</p>
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-3">
        {invitations.map((invitation, index) => (
          <motion.div
            key={invitation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
          >
            <Link
              href={`/dashboard/invitations/${invitation.id}`}
              className="block group"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all bg-gradient-to-r from-white to-slate-50/50 hover:from-slate-50 hover:to-slate-100/50">
                {/* Rank Badge */}
                <div className="relative flex-shrink-0">
                  {index < 3 ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, type: 'spring', stiffness: 200 }}
                      className={cn(
                        'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center shadow-md',
                        rankColors[index as keyof typeof rankColors]
                      )}
                    >
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </motion.div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-600 font-semibold">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Invitation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {invitation.title}
                    </h3>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
                        typeColors[invitation.type] || typeColors['Diğer']
                      )}
                    >
                      {invitation.type}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{invitation.views.toLocaleString('tr-TR')}</span>
                      <span className="text-slate-400">görüntülenme</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <UserCheck className="w-4 h-4" />
                      <span className="font-medium">{invitation.rsvps.toLocaleString('tr-TR')}</span>
                      <span className="text-slate-400">RSVP</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>{invitation.rsvpRate}%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">dönüşüm</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 text-center">
          Dönüşüm oranı: (RSVP sayısı / Görüntülenme sayısı) × 100
        </p>
      </div>
    </motion.div>
  )
}
