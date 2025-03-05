"use client"

import { IncidentsSummary } from "@/components/features/dashboard/incidents-summary"
import { ServiceGrid } from "@/components/features/dashboard/service-grid"
import { WelcomeBanner } from "@/components/features/dashboard/welcome-banner"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <WelcomeBanner />
      <div className="p-6">
        <ServiceGrid />
        <IncidentsSummary />
      </div>
    </div>
  )
}

