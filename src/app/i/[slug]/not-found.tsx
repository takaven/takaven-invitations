'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InvitationNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center max-w-md"
      >
        {/* Sad envelope icon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center"
        >
          <Mail className="w-12 h-12 text-slate-400" />
        </motion.div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Davetiye Bulunamadı
          </h1>
          <p className="text-slate-500">
            Aradığınız davetiye mevcut değil, henüz yayınlanmamış veya kaldırılmış olabilir.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="default" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Bir davetiye oluşturmak ister misiniz?{' '}
          <Link href="/dashboard/create" className="text-indigo-600 hover:underline">
            Hemen başlayın
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
