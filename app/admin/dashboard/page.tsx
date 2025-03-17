"use client"

import { motion } from "framer-motion"
import { AdminWelcomeBanner } from "@/components/features/admin/welcome-banner"
import { AdminServiceGrid } from "@/components/features/admin/service-grid"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const { userInfo } = useAuth()

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AdminWelcomeBanner />
      </motion.div>

      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AdminServiceGrid />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Admin Dashboard Overview</h2>
              <p className="text-muted-foreground">
                Welcome to the admin dashboard. Here you can manage users, view system statistics, and configure system
                settings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700">Total Users</h3>
                  <p className="text-2xl font-bold mt-2">247</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-700">Active Tickets</h3>
                  <p className="text-2xl font-bold mt-2">32</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-700">System Health</h3>
                  <p className="text-2xl font-bold mt-2">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

