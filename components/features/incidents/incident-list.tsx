"use client"

import {
  AlertTriangle,
  Clock,
  CheckCircle,
  ExternalLink,
  XCircle,
  Info,
  AlertCircle,
  UserCheck,
  ArrowUp,
  RefreshCw,
  MapPin,
  Package,
  UserPlus,
  RefreshCcw,
  Calendar,
  Building,
  MessageSquare,
  PenToolIcon as Tool,
  User,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIncidents } from "@/hooks/useIncidents"
import { useAuth } from "@/components/auth/auth-provider"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

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

  // Update the getStatusIcon function to use the hook
  const getStatusIcon = (status: number) => {
    const statusDesc = getStatusDescription(status)

    // Map status descriptions to icons
    switch (statusDesc.toLowerCase()) {
      case "new":
        return <AlertCircle className="h-4 w-4" />
      case "assigned":
        return <UserCheck className="h-4 w-4" />
      case "in progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "waiting for customer":
        return <Clock className="h-4 w-4" /> // Using Clock as fallback
      case "escalated":
        return <ArrowUp className="h-4 w-4" />
      case "reopened":
        return <RefreshCw className="h-4 w-4" />
      case "on-site visit":
        return <MapPin className="h-4 w-4" />
      case "awaiting shipment":
        return <Package className="h-4 w-4" />
      case "on boarding":
        return <UserPlus className="h-4 w-4" />
      case "awaiting replacement":
        return <RefreshCcw className="h-4 w-4" /> // Using RefreshCcw as replacement icon
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "waiting for vendor response":
        return <Building className="h-4 w-4" />
      case "response received":
        return <MessageSquare className="h-4 w-4" />
      case "on-site progress":
        return <Tool className="h-4 w-4" />
      case "user response":
        return <User className="h-4 w-4" />
      // Legacy status mappings
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  // Update the getStatusColor function to use the hook
  const getStatusColor = (status: number) => {
    const statusDesc = getStatusDescription(status)

    // Map status descriptions to colors
    switch (statusDesc.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-amber-100 text-amber-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        // Try to determine color based on keywords in the status description
        if (statusDesc.toLowerCase().includes("progress") || statusDesc.toLowerCase().includes("pending")) {
          return "bg-amber-100 text-amber-800"
        } else if (statusDesc.toLowerCase().includes("resolv") || statusDesc.toLowerCase().includes("complete")) {
          return "bg-green-100 text-green-800"
        } else if (statusDesc.toLowerCase().includes("cancel")) {
          return "bg-red-100 text-red-800"
        } else if (statusDesc.toLowerCase().includes("close")) {
          return "bg-gray-100 text-gray-800"
        }
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
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-4 pb-4">
        {incidents.map((incident) => (
          <Card key={incident.CodTicket} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
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
                    <p>Updated: {formatDate(incident.DueDatetime)}</p>
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
    </ScrollArea>
  )
}

