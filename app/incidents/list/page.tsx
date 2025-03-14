"use client"

import { IncidentList } from "@/components/features/incidents/incident-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

export default function IncidentsListPage() {
  return (
    <div className="container mx-auto py-6">
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold">My Incidents</h1>
        <Link href="/incidents">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Report New Incident
          </Button>
        </Link>
      </motion.div>

      <IncidentList />
    </div>
  )
}

