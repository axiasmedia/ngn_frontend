"use client"

import TechnicianWelcomeBanner from "@/components/features/technician/welcome-banner"
import TechnicianServiceGrid from "@/components/features/technician/service-grid"

export default function TechnicianDashboardPage() {
  return (
    <div className="container mx-auto p-4 lg:p-6">
      <TechnicianWelcomeBanner />
      <TechnicianServiceGrid />
    </div>
  )
}

