"use client"

import { motion } from "framer-motion"

export function WelcomeBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-600 to-stone-900 text-white py-8 px-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl md:text-3xl font-medium text-center">Welcome to Chrysalis Health IT Portal</h1>
        <motion.p
          className="text-center mt-2 text-gray-100 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Access support, resources, and manage your IT services all in one place
        </motion.p>
      </motion.div>
    </div>
  )
}

