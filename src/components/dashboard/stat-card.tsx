'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Mail, Eye, FileCheck, FilePlus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  iconName: 'mail' | 'eye' | 'fileCheck' | 'filePlus'
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'indigo' | 'purple' | 'pink' | 'emerald' | 'amber'
  delay?: number
}

const colorVariants = {
  indigo: 'from-indigo-500 to-indigo-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600'
}

const bgVariants = {
  indigo: 'bg-indigo-50',
  purple: 'bg-purple-50',
  pink: 'bg-pink-50',
  emerald: 'bg-emerald-50',
  amber: 'bg-amber-50'
}

const icons = {
  mail: Mail,
  eye: Eye,
  fileCheck: FileCheck,
  filePlus: FilePlus
}

export function StatCard({ title, value, iconName, trend, color = 'indigo', delay = 0 }: StatCardProps) {
  const Icon = icons[iconName]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-3xl font-bold text-slate-900 mt-2"
          >
            {value}
          </motion.p>
          {trend && (
            <p className={cn(
              'text-sm mt-2 font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-red-500'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-slate-400 font-normal ml-1">bu ay</span>
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', bgVariants[color])}>
          <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center', colorVariants[color])}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
