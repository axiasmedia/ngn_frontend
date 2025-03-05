"use client"

import { IncidentList } from "@/components/features/incidents/incident-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function IncidentsListPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Incidents</h1>
        <Link href="/incidents">
          <Button>Report New Incident</Button>
        </Link>
      </div>

      <IncidentList />
    </div>
  )
}

