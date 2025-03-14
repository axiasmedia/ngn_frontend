"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { AlertCircle, Clock, CheckCircle } from "lucide-react"

// Mock data for incidents
const incidents = [
  {
    id: "INC-2023-001",
    title: "Email access issue",
    status: "In Progress",
    priority: "High",
    updated: "2 hours ago",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    id: "INC-2023-002",
    title: "Printer configuration",
    status: "Resolved",
    priority: "Medium",
    updated: "1 day ago",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: "INC-2023-003",
    title: "VPN connection failure",
    status: "Open",
    priority: "High",
    updated: "3 hours ago",
    icon: AlertCircle,
    color: "text-red-500",
  },
]

export function IncidentsSummary() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">High priority incidents</h2>
      <Card className="bg-white p-4">
        <div className="space-y-4">
          {incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`mr-3 ${incident.color}`}>
                  <incident.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium truncate">{incident.title}</p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
                      {incident.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">{incident.id}</p>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground">Updated {incident.updated}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-muted-foreground"
            >
              No high priority incidents at this time
            </motion.div>
          )}

          <motion.div
            className="mt-2 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a href="/incidents/list" className="text-sm text-primary font-medium hover:underline">
              View all incidents →
            </a>
          </motion.div>
        </div>
      </Card>
    </div>
  )
}

