'use client'

import { motion } from 'framer-motion'

export default function InvitationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated envelope */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotateZ: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-16 relative"
        >
          {/* Envelope body */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shadow-lg" />
          {/* Envelope flap */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-t-lg"
            style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
          />
          {/* Heart */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
          >
            💌
          </motion.div>
        </motion.div>

        <div className="text-center">
          <p className="text-lg font-medium text-slate-700">Davetiye Açılıyor</p>
          <p className="text-sm text-slate-500 mt-1">Lütfen bekleyin...</p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-indigo-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
