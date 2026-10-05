'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { signOut } from '@/lib/actions/auth'
import {
  LayoutDashboard,
  Mail,
  Plus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  BarChart3,
  HelpCircle
} from 'lucide-react'

const menuItems = [
  {
    title: 'Ana Menü',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Plus, label: 'Yeni Davetiye', href: '/dashboard/create' },
      { icon: Mail, label: 'Davetiyelerim', href: '/dashboard/invitations' },
    ]
  },
  {
    title: 'İstatistikler',
    items: [
      { icon: BarChart3, label: 'Analitik', href: '/dashboard/analytics' },
      { icon: Users, label: 'RSVP Yanıtları', href: '/dashboard/responses' },
    ]
  },
  {
    title: 'Diğer',
    items: [
      { icon: Settings, label: 'Ayarlar', href: '/dashboard/settings' },
      { icon: HelpCircle, label: 'Yardım', href: '/dashboard/help' },
    ]
  }
]

interface SidebarProps {
  user: {
    email?: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const userInitials = user.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
        'border-r border-slate-800 flex flex-col sticky top-0'
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-lg text-white"
              >
                Davetiye
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <Separator className="bg-slate-800" />

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                        'text-slate-400 hover:text-white hover:bg-slate-800/60',
                        isActive && 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-indigo-400')} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <Separator className="bg-slate-800" />

      {/* User Profile */}
      <div className="p-4">
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-lg bg-slate-800/50',
          collapsed && 'justify-center'
        )}>
          <Avatar className="w-9 h-9 border-2 border-indigo-500">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  {user.email}
                </p>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    Çıkış Yap
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
