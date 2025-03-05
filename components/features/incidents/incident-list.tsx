"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

// Mock data for incidents
const mockIncidents = [
  {
    id: "INC-001",
    title: "Email not working",
    status: "open",
    priority: "high",
    createdAt: "2025-03-01T10:30:00Z",
    updatedAt: "2025-03-02T14:20:00Z",
  },
  {
    id: "INC-002",
    title: "Printer not connecting",
    status: "in-progress",
    priority: "medium",
    createdAt: "2025-03-02T09:15:00Z",
    updatedAt: "2025-03-03T11:45:00Z",
  },
  {
    id: "INC-003",
    title: "Software installation request",
    status: "resolved",
    priority: "low",
    createdAt: "2025-02-28T16:20:00Z",
    updatedAt: "2025-03-01T08:30:00Z",
  },
]

export function IncidentList() {
  // In a real application, this would come from an API call
  const [incidents, setIncidents] = useState(mockIncidents)

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  // Function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open"
      case "in-progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
      default:
        return status
    }
  }

  if (incidents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No incidents found</h3>
          <p className="text-muted-foreground mb-6">You don't have any reported incidents yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <Card key={incident.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(incident.status)}
                  <span className="text-sm font-medium">{getStatusText(incident.status)}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {incident.priority.charAt(0).toUpperCase() + incident.priority.slice(1)}
                  </span>
                </div>
                <h3 className="font-medium">{incident.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Incident ID: {incident.id}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Created: {formatDate(incident.createdAt)}</p>
                <p>Updated: {formatDate(incident.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

