"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"

export function AdminWelcomeBanner() {
  const { userInfo } = useAuth()

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-8 px-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl md:text-3xl font-medium text-center">Admin Dashboard</h1>
        <motion.p
          className="text-center mt-2 text-indigo-100 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Manage users, monitor system health, and configure settings
        </motion.p>
      </motion.div>
    </div>
  )
}

