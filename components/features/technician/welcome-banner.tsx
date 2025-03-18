"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { motion } from "framer-motion"

export default function TechnicianWelcomeBanner() {
  const { userInfo } = useAuth()

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {userInfo?.email ? userInfo.email.split('@')[0] : "Technician"}. Access all your support tools and resources from this dashboard.
      </p>
    </motion.div>
  )
}
