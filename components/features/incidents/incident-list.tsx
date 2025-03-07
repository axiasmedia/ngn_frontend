"use client"

import { AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useIncidents } from "@/hooks/useIncidents"
import { getStatusString } from "@/services/incidents/types"
import { useAuth } from "@/components/auth/auth-provider"

export function IncidentList() {
  const { userInfo } = useAuth()
  const { incidents, loading, error } = useIncidents(userInfo?.id)

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to get status icon
  const getStatusIcon = (status: number) => {
    const statusString = getStatusString(status)
    switch (statusString) {
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
  const getStatusText = (status: number) => {
    const statusString = getStatusString(status)
    return statusString.charAt(0).toUpperCase() + statusString.slice(1)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p>Loading incidents...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Error loading incidents</h3>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!incidents || incidents.length === 0) {
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
        <Card key={incident.IDTicket} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(incident.Status)}
                  <span className="text-sm font-medium">{getStatusText(incident.Status)}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {incident.Priority.charAt(0).toUpperCase() + incident.Priority.slice(1)}
                  </span>
                </div>
                <h3 className="font-medium">{incident.Title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Incident ID: {incident.CodTicket}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Created: {formatDate(incident.CreatedDatatime)}</p>
                <p>Updated: {incident.ModDatetime ? formatDate(incident.ModDatetime) : "Not updated"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

