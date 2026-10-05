'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Eye, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PerformanceChart Component - Visual chart showing invitation performance
 *
 * Features:
 * - Pure CSS bar chart (no external chart library needed)
 * - Dual metrics: views and RSVPs
 * - Animated bars with hover effects
 * - Responsive layout
 * - Accessible with ARIA labels
 *
 * Props:
 * @param data - Array of daily performance data
 *
 * Usage:
 * <PerformanceChart data={[
 *   { date: 'Jan 1', views: 120, rsvps: 45 },
 *   { date: 'Jan 2', views: 150, rsvps: 52 }
 * ]} />
 */

interface ChartData {
  date: string
  views: number
  rsvps: number
}

interface PerformanceChartProps {
  data: ChartData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Calculate max value for scaling
  const maxViews = Math.max(...data.map(d => d.views), 1)
  const maxRSVPs = Math.max(...data.map(d => d.rsvps), 1)
  const maxValue = Math.max(maxViews, maxRSVPs)

  const totalViews = data.reduce((sum, d) => sum + d.views, 0)
  const totalRSVPs = data.reduce((sum, d) => sum + d.rsvps, 0)

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
      >
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Henüz veri yok
          </h3>
          <p className="text-slate-500">
            Davetiyeleriniz görüntülenmeye başladığında burada grafikler göreceksiniz.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      role="region"
      aria-label="Performans grafiği"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Performans Özeti
          </h2>
          <p className="text-sm text-slate-500 mt-1">Son 7 günlük aktivite</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600" />
            <span className="text-sm text-slate-600">Görüntülenme</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600" />
            <span className="text-sm text-slate-600">RSVP</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Toplam Görüntülenme</p>
              <p className="text-2xl font-bold text-indigo-900">
                {totalViews.toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">Toplam RSVP</p>
              <p className="text-2xl font-bold text-emerald-900">
                {totalRSVPs.toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" role="img" aria-label="Bar chart showing views and RSVPs over time">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400 w-8">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10">
          {/* Grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-full h-px bg-slate-100" />
            ))}
          </div>

          {/* Bars */}
          <div className="relative flex items-end justify-between gap-2 h-64 pt-4">
            {data.map((item, index) => {
              const viewHeight = maxValue > 0 ? (item.views / maxValue) * 100 : 0
              const rsvpHeight = maxValue > 0 ? (item.rsvps / maxValue) * 100 : 0

              return (
                <motion.div
                  key={item.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-2 group"
                  role="group"
                  aria-label={`${item.date}: ${item.views} görüntülenme, ${item.rsvps} RSVP`}
                >
                  {/* Bars container */}
                  <div className="w-full flex items-end justify-center gap-1 flex-1">
                    {/* Views bar */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.05, ease: 'easeOut' }}
                      className="relative flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg origin-bottom hover:from-indigo-600 hover:to-indigo-500 transition-all cursor-pointer min-w-[20px]"
                      style={{ height: `${viewHeight}%` }}
                      title={`${item.views} görüntülenme`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.views}
                        </div>
                      </div>
                    </motion.div>

                    {/* RSVPs bar */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: 0.65 + index * 0.05, ease: 'easeOut' }}
                      className="relative flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg origin-bottom hover:from-emerald-600 hover:to-emerald-500 transition-all cursor-pointer min-w-[20px]"
                      style={{ height: `${rsvpHeight}%` }}
                      title={`${item.rsvps} RSVP`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.rsvps}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Date label */}
                  <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    {item.date}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
