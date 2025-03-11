"use client"

import { AlertTriangle, Clock, CheckCircle, ExternalLink, XCircle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIncidents } from "@/hooks/useIncidents"
import { useAuth } from "@/components/auth/auth-provider"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Update the component to use the useTicketStatuses hook
export function IncidentList() {
  const { userInfo } = useAuth()
  const { incidents, loading, error } = useIncidents(userInfo?.id)
  const { statuses, getStatusDescription } = useTicketStatuses()

  // Function to safely format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not updated"
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  // Update the getStatusIcon function to handle all status codes
  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <AlertTriangle className="h-4 w-4" />
      case 2:
        return <Clock className="h-4 w-4" />
      case 3:
        return <CheckCircle className="h-4 w-4" />
      case 4:
        return <CheckCircle className="h-4 w-4" />
      case 5:
        return <Clock className="h-4 w-4" />
      case 6:
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  // Update the getStatusColor function to handle all status codes
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-blue-100 text-blue-800"
      case 2:
        return "bg-amber-100 text-amber-800"
      case 3:
        return "bg-green-100 text-green-800"
      case 4:
        return "bg-gray-100 text-gray-800"
      case 5:
        return "bg-purple-100 text-purple-800"
      case 6:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        <Card key={incident.CodTicket} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getStatusColor(incident.Status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(incident.Status)}
                      {getStatusDescription(incident.Status)}
                    </span>
                  </Badge>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {incident.Priority.charAt(0).toUpperCase() + incident.Priority.slice(1)}
                  </span>
                </div>
                <h3 className="font-medium">{incident.Title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Ticket ID: {incident.CodTicket}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-2">
                  <p>Created: {formatDate(incident.CreatedDatatime)}</p>
                  <p>Updated: {formatDate(incident.ModDatetime)}</p>
                </div>
                <Link href={`/incidents/${incident.CodTicket}`}>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

