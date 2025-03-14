"use client"

import { useQueueTickets } from "@/hooks/useQueueTickets"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
  XCircle,
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
  HelpCircle,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

export default function TechnicianDashboardPage() {
  const { tickets, loading, error } = useQueueTickets()
  const { getStatusDescription, getStatusColorById, getStatusIconById } = useTicketStatuses()

  // Update the getStatusInfo function to handle all the new icons
  const getStatusInfo = (status: number) => {
    const statusDescription = getStatusDescription(status)
    const colorClass = getStatusColorById(status)

    // Map icon string to Lucide icon component
    let iconComponent
    const iconType = getStatusIconById(status)
    switch (iconType) {
      case "alert-circle":
        iconComponent = <AlertTriangle className="h-4 w-4" />
        break
      case "clock":
        iconComponent = <Clock className="h-4 w-4" />
        break
      case "check-circle":
        iconComponent = <CheckCircle className="h-4 w-4" />
        break
      case "x-circle":
        iconComponent = <XCircle className="h-4 w-4" />
        break
      case "user-check":
        iconComponent = <UserCheck className="h-4 w-4" />
        break
      case "arrow-up":
        iconComponent = <ArrowUp className="h-4 w-4" />
        break
      case "refresh-cw":
        iconComponent = <RefreshCw className="h-4 w-4" />
        break
      case "map-pin":
        iconComponent = <MapPin className="h-4 w-4" />
        break
      case "package":
        iconComponent = <Package className="h-4 w-4" />
        break
      case "user-plus":
        iconComponent = <UserPlus className="h-4 w-4" />
        break
      case "replace":
        iconComponent = <RefreshCcw className="h-4 w-4" /> // Using RefreshCcw as a replacement icon
        break
      case "calendar":
        iconComponent = <Calendar className="h-4 w-4" />
        break
      case "building":
        iconComponent = <Building className="h-4 w-4" />
        break
      case "message-square":
        iconComponent = <MessageSquare className="h-4 w-4" />
        break
      case "tool":
        iconComponent = <Tool className="h-4 w-4" />
        break
      case "user":
        iconComponent = <User className="h-4 w-4" />
        break
      case "user-clock":
        iconComponent = <Clock className="h-4 w-4" /> // Fallback since UserClock isn't in Lucide
        break
      default:
        iconComponent = <HelpCircle className="h-4 w-4" />
    }

    return {
      text: statusDescription,
      color: colorClass,
      icon: iconComponent,
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
      const date = new Date(dateString)
      return format(date, "dd/MM/yyyy HH:mm")
    } catch (error) {
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading tickets...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Error loading tickets</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">All Tickets</h1>
        <Link href="/technician/tickets/new">
          <Button size="default" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Ticket
          </Button>
        </Link>
      </div>

      {/* Mobile view - Card-based layout for small screens */}
      <div className="md:hidden space-y-4">
        {tickets.map((ticket) => {
          const statusInfo = getStatusInfo(ticket.Status)
          return (
            <Card key={ticket.CodTicket} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{ticket.Title}</h3>
                  <p className="text-sm text-muted-foreground">#{ticket.CodTicket}</p>
                </div>
                <Badge className={getPriorityColor(ticket.Priority)}>{ticket.Priority}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Client:</p>
                  <p className="truncate">{ticket.ClientName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assignee:</p>
                  <p className="truncate">
                    {ticket.AssignedToUser ? ticket.AssignedUserName || "Loading..." : "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created:</p>
                  <p>{formatDate(ticket.CreatedDatatime)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status:</p>
                  <Badge className={statusInfo.color}>
                    <span className="flex items-center gap-1">
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </span>
                  </Badge>
                </div>
              </div>

              <Link href={`/technician/tickets/${ticket.CodTicket}`} className="block w-full">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Details
                </Button>
              </Link>
            </Card>
          )
        })}
      </div>

      {/* Desktop view - Table-based layout with both horizontal and vertical scrollbars */}
      <div className="hidden md:block">
        <Card className="rounded-md border shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] w-full">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <Table className="w-full table-fixed">
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[10%] font-semibold">Ticket ID</TableHead>
                      <TableHead className="w-[20%] font-semibold">Title</TableHead>
                      <TableHead className="w-[10%] font-semibold">Client</TableHead>
                      <TableHead className="w-[10%] font-semibold">Assignee</TableHead>
                      <TableHead className="w-[10%] font-semibold">Created</TableHead>
                      <TableHead className="w-[10%] font-semibold">Due Date</TableHead>
                      <TableHead className="w-[8%] font-semibold">Priority</TableHead>
                      <TableHead className="w-[12%] font-semibold">Status</TableHead>
                      <TableHead className="w-[10%] text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => {
                      const statusInfo = getStatusInfo(ticket.Status)
                      return (
                        <TableRow key={ticket.CodTicket} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{ticket.CodTicket}</TableCell>
                          <TableCell className="max-w-[250px] truncate" title={ticket.Title}>
                            {ticket.Title}
                          </TableCell>
                          <TableCell className="truncate" title={ticket.ClientName}>
                            {ticket.ClientName}
                          </TableCell>
                          <TableCell className="max-w-[120px] truncate">
                            <div className="truncate" title={ticket.AssignedUserName || "Unassigned"}>
                              {ticket.AssignedToUser ? ticket.AssignedUserName || "Loading..." : "Unassigned"}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(ticket.CreatedDatatime)}</TableCell>
                          <TableCell>{ticket.Availability ? formatDate(ticket.Availability) : "Not set"}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(ticket.Priority)}>{ticket.Priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusInfo.color}>
                              <span className="flex items-center gap-1">
                                {statusInfo.icon}
                                <span>{statusInfo.text}</span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right min-w-[120px]">
                            <Link href={`/technician/tickets/${ticket.CodTicket}`} className="block">
                              <Button variant="outline" size="sm" className="w-full whitespace-nowrap">
                                View Details
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

