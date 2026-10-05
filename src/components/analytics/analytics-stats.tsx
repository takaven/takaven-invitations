'use client'

import { motion } from 'framer-motion'
import { Eye, UserCheck, TrendingUp, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * AnalyticsStats Component - Overview statistics cards
 *
 * Features:
 * - Animated stat cards with trends
 * - Color-coded metrics
 * - Responsive grid layout
 *
 * Props:
 * @param totalViews - Total invitation views
 * @param totalRSVPs - Total RSVP responses
 * @param rsvpRate - RSVP conversion rate percentage
 * @param engagementRate - Overall engagement rate
 * @param viewsTrend - Views trend percentage (+ or -)
 * @param rsvpTrend - RSVP trend percentage (+ or -)
 *
 * Usage:
 * <AnalyticsStats
 *   totalViews={1250}
 *   totalRSVPs={48}
 *   rsvpRate={38}
 *   engagementRate={42}
 *   viewsTrend={15}
 *   rsvpTrend={-5}
 * />
 */

interface AnalyticsStatsProps {
  totalViews: number
  totalRSVPs: number
  rsvpRate: number
  engagementRate: number
  viewsTrend: number
  rsvpTrend: number
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: number
  suffix?: string
  color: 'indigo' | 'emerald' | 'purple' | 'pink'
  delay: number
}

const colorVariants = {
  indigo: {
    bg: 'bg-indigo-50',
    gradient: 'from-indigo-500 to-indigo-600',
    text: 'text-indigo-600'
  },
  emerald: {
    bg: 'bg-emerald-50',
    gradient: 'from-emerald-500 to-emerald-600',
    text: 'text-emerald-600'
  },
  purple: {
    bg: 'bg-purple-50',
    gradient: 'from-purple-500 to-purple-600',
    text: 'text-purple-600'
  },
  pink: {
    bg: 'bg-pink-50',
    gradient: 'from-pink-500 to-pink-600',
    text: 'text-pink-600'
  }
}

function StatCard({ title, value, icon, trend, suffix = '', color, delay }: StatCardProps) {
  const colors = colorVariants[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-[1.02]"
      role="article"
      aria-label={`${title}: ${value}${suffix}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
            className="flex items-baseline gap-2 mt-2"
          >
            <p className="text-3xl font-bold text-slate-900">
              {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
              <span className="text-lg text-slate-500 ml-1">{suffix}</span>
            </p>
          </motion.div>
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
              className={cn(
                'flex items-center gap-1 mt-2 text-sm font-medium',
                trend >= 0 ? 'text-emerald-600' : 'text-red-500'
              )}
            >
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}%</span>
              <span className="text-slate-400 font-normal ml-1">bu ay</span>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
          className={cn('p-3 rounded-xl', colors.bg)}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
              colors.gradient
            )}
          >
            {icon}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function AnalyticsStats({
  totalViews,
  totalRSVPs,
  rsvpRate,
  engagementRate,
  viewsTrend,
  rsvpTrend
}: AnalyticsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Toplam Görüntülenme"
        value={totalViews}
        icon={<Eye className="w-5 h-5 text-white" />}
        trend={viewsTrend}
        color="indigo"
        delay={0}
      />
      <StatCard
        title="Toplam RSVP"
        value={totalRSVPs}
        icon={<UserCheck className="w-5 h-5 text-white" />}
        trend={rsvpTrend}
        color="emerald"
        delay={0.1}
      />
      <StatCard
        title="RSVP Oranı"
        value={rsvpRate}
        suffix="%"
        icon={<TrendingUp className="w-5 h-5 text-white" />}
        color="purple"
        delay={0.2}
      />
      <StatCard
        title="Etkileşim Oranı"
        value={engagementRate}
        suffix="%"
        icon={<Activity className="w-5 h-5 text-white" />}
        color="pink"
        delay={0.3}
      />
    </div>
  )
}
