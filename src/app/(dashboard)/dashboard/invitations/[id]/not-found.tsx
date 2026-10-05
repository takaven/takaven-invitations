'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InvitationNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <FileQuestion className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Davetiye Bulunamadı</h2>
        <p className="text-sm text-slate-500">
          Aradığınız davetiye mevcut değil veya silinmiş olabilir.
        </p>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/dashboard/invitations">
            <ArrowLeft className="w-4 h-4" />
            Davetiyelerime Dön
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
