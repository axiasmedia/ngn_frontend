"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { motion } from "framer-motion"
import { Key, PenToolIcon as Tool, Wrench, Settings } from "lucide-react"

export default function TechnicianWelcomeBanner() {
  const { userInfo } = useAuth()

  const username = userInfo?.email ?
  userInfo.email.split("@")[0] :
  "Technician"
  return (
    <motion.div
      className="mb-8 w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative p-8 md:p-10 bg-gradient-to-r from-blue-700 vida-blue-600 to-indigo-700 text-withe overflow-hidden">
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-15 animate-float">
        <Settings className="w-80 h-80 text-blue-00 animate-spin" style={{ animationDuration: "15s"}}/>
        </div>
        <div className="absolute left-1/2 bottom-10 opacity-20 animate-float-delay-2">
        <Wrench className="w-20 h-20 text-white rotate-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-16 left-32 opacity-15">
        <Key className="w-20 h-20 text-blue-200 rotate-45" />
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 md:-80 md:h-80 bg-white opacity-5 rounded-full -mt-20 -mr20"></div>
        <div className="absolute buttom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -mb-16 -ml-16"></div>
        <div className="abosolute top-1/2 left-1/4 w-16 h-16 bg-indigo-300 opacity-300 opacity-10 rounded-full"></div>

        <div className="relative z-10 max-w-x1">
          <div className="inline-block bg-blue-800 bg-opacity-30 px-3 py-1 rounded-full text-ts font-semilbold text-blue-100 mb-3">
            TECHNICIAN PORTAL
          </div>
          <h1 className="text-4x1 md:text-5x1 lg:text-6x1 font-bold mb-4 trancking-tight">Technician Dashboard</h1>
          <div className="h-1 w-20 bg-blue-400 rounded mb-6"></div>
          <p className="text-blue-100 max-w-3x1 text-lg">
            Welcome Back, <span className="font-semibold text-white">{username}</span>. Access all your support tools and resources from this dashboard.  
          </p>
          <div className="mt-4 text-sm text-blue-200 opacity-80">Providing technical solutions and support</div>
        </div>
      </div>
    </motion.div>
  )
}
