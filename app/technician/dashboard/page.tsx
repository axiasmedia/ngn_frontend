"use client"

import TechnicianWelcomeBanner from "@/components/features/technician/welcome-banner"
import TechnicianServiceGrid from "@/components/features/technician/service-grid"

export default function TechnicianDashboardPage() {
  return (
    <div className="w-full">
      <TechnicianWelcomeBanner />
      <div className="container mx-auto px-4 lg:px-6">
        <TechnicianServiceGrid />
      </div>
    </div>
  )
}

