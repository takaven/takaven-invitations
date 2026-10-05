'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function InvitationEditLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Davetiye yükleniyor...</p>
      </motion.div>
    </div>
  )
}
