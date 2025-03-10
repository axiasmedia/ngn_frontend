"use client"

import { useQueueTickets } from "@/hooks/useQueueTickets"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function TechnicianDashboardPage() {
  const { tickets, loading, error } = useQueueTickets()

  // Function to get status text and color
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return {
          text: "Open",
          color: "bg-blue-100 text-blue-800",
          icon: <AlertTriangle className="h-4 w-4" />,
        }
      case 2:
        return {
          text: "In Progress",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4" />,
        }
      case 3:
        return {
          text: "Resolved",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4" />,
        }
      default:
        return {
          text: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertTriangle className="h-4 w-4" />,
        }
    }
  }

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy hh:mm a")
    } catch (error) {
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading tickets...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Error loading tickets</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Tickets</h1>
        <Link href="/technician/tickets/new">
          <Button>Create New Ticket</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Open Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const statusInfo = getStatusInfo(ticket.Status)
              return (
                <TableRow key={ticket.CodTicket}>
                  <TableCell className="font-medium">{ticket.CodTicket}</TableCell>
                  <TableCell>{ticket.Title}</TableCell>
                  <TableCell>{ticket.ClientName}</TableCell>
                  <TableCell>{ticket.AssignedUserName || "Unassigned"}</TableCell>
                  <TableCell>{formatDate(ticket.CreatedDatatime)}</TableCell>
                  <TableCell>{ticket.Availability ? formatDate(ticket.Availability) : "Not set"}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.Priority)}>{ticket.Priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusInfo.color}>
                      <span className="flex items-center gap-1">
                        {statusInfo.icon}
                        {statusInfo.text}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/technician/tickets/${ticket.CodTicket}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

