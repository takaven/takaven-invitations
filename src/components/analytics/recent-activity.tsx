'use client'

import { motion } from 'framer-motion'
import { Activity, Eye, UserCheck, Plus, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * RecentActivity Component - Timeline of recent invitation activities
 *
 * Features:
 * - Timeline view with icons
 * - Multiple activity types (views, RSVPs, created)
 * - Relative timestamps
 * - Color-coded activity types
 * - Animated entrance
 *
 * Props:
 * @param activities - Array of activity events
 *
 * Usage:
 * <RecentActivity activities={recentActivitiesList} />
 */

interface Activity {
  id: string
  type: 'view' | 'rsvp' | 'created'
  invitationTitle: string
  timestamp: string
  guestName?: string
  details?: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const activityConfig = {
  view: {
    icon: Eye,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    label: 'Görüntülendi'
  },
  rsvp: {
    icon: UserCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    label: 'RSVP Alındı'
  },
  created: {
    icon: Plus,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    label: 'Oluşturuldu'
  }
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Az önce'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} dakika önce`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} saat önce`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} gün önce`
  } else {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Son Aktiviteler
        </h2>
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Henüz aktivite yok
          </h3>
          <p className="text-slate-500">
            Davetiyelerinizle ilgili aktiviteler burada görünecek.
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
      aria-label="Son aktiviteler zaman çizelgesi"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Son Aktiviteler
          </h2>
          <p className="text-sm text-slate-500">En son 10 etkinlik</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />

        {/* Activities */}
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type]
            const Icon = config.icon

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                className="relative flex gap-4 group"
                role="article"
                aria-label={`${config.label}: ${activity.invitationTitle}`}
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.65 + index * 0.05, type: 'spring', stiffness: 200 }}
                  className={cn(
                    'relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110',
                    config.bg
                  )}
                >
                  <Icon className={cn('w-5 h-5', config.color)} />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="bg-slate-50/80 rounded-lg p-3 group-hover:bg-slate-100 transition-colors">
                    {/* Activity Header */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {activity.invitationTitle}
                        </p>
                        {activity.guestName && (
                          <p className="text-sm text-slate-600 mt-0.5">
                            <span className="font-medium">{activity.guestName}</span>
                            {activity.details && (
                              <span className="text-slate-500"> • {activity.details}</span>
                            )}
                          </p>
                        )}
                        {!activity.guestName && activity.details && (
                          <p className="text-sm text-slate-500 mt-0.5">
                            {activity.details}
                          </p>
                        )}
                      </div>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                        config.bg,
                        config.color
                      )}>
                        {config.label}
                      </span>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                      <Clock className="w-3 h-3" />
                      <time dateTime={activity.timestamp}>
                        {formatRelativeTime(activity.timestamp)}
                      </time>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 text-center">
          Tüm zaman çizelgesi için davetiye detaylarına göz atın
        </p>
      </div>
    </motion.div>
  )
}
