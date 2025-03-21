"use client"

import { motion } from "framer-motion"
import { Sparkles, Laptop } from "lucide-react"

export function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-10 px-6 rounded-lg shadow-lg">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 w-24 h-24"
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0.3,
            }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 10 + Math.random() * 10,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-4 bg-white/20 p-4 rounded-full"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to Chrysalis Health IT Portal
          </motion.h1>

          <motion.div
            className="flex items-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Laptop className="w-5 h-5" />
            <p className="text-lg text-white/90">Your digital support hub for all IT needs</p>
          </motion.div>

          <motion.p
            className="text-center mt-4 text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Access support, manage tickets, and find resources all in one place
          </motion.p>
        </div>
      </div>
    </div>
  )
}

