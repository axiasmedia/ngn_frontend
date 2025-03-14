"use client"

import { IncidentsSummary } from "@/components/features/dashboard/incidents-summary"
import { ServiceGrid } from "@/components/features/dashboard/service-grid"
import { WelcomeBanner } from "@/components/features/dashboard/welcome-banner"
import { motion } from "framer-motion"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <WelcomeBanner />
      </motion.div>
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ServiceGrid />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <IncidentsSummary />
        </motion.div>
      </motion.div>
    </div>
  )
}

