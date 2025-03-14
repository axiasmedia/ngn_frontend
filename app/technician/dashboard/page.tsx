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
  Search,
  Eye,
  Edit,
  Inbox,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TechnicianDashboardPage() {
  const { tickets, loading, error } = useQueueTickets()
  const { getStatusDescription, getStatusColorById, getStatusIconById } = useTicketStatuses()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter tickets based on search query and filters
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchQuery === "" ||
      ticket.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.CodTicket.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ClientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.Status.toString() === statusFilter

    const matchesPriority = priorityFilter === "all" || ticket.Priority.toLowerCase() === priorityFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority
  })

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
      return format(date, "MMM dd, h:mm a")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <motion.div className="flex justify-center items-center h-64" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading tickets...</span>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <motion.div
          className="flex flex-col items-center justify-center h-64"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Error loading tickets</h3>
          <p className="text-muted-foreground">{error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold">All Tickets</h1>
        <Link href="/technician/tickets/new">
          <Button size="default" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Ticket
          </Button>
        </Link>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {/* Get unique status IDs from tickets */}
            {Array.from(new Set(tickets.map((ticket) => ticket.Status)))
              .sort((a, b) => a - b)
              .map((statusId) => (
                <SelectItem key={statusId} value={statusId.toString()}>
                  {getStatusDescription(statusId)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Mobile view - Card-based layout for small screens */}
      <motion.div className="md:hidden space-y-4" variants={containerVariants} initial="hidden" animate="visible">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => {
            const statusInfo = getStatusInfo(ticket.Status)
            return (
              <motion.div key={ticket.CodTicket} variants={itemVariants}>
                <Card
                  className="overflow-hidden border-l-4"
                  style={{
                    borderLeftColor: statusInfo.color.includes("bg-")
                      ? statusInfo.color.replace("bg-", "var(--") + ")"
                      : "var(--border)",
                  }}
                >
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium line-clamp-1">{ticket.Title}</h3>
                          <p className="text-sm text-muted-foreground">#{ticket.CodTicket}</p>
                        </div>
                        <Badge className={getPriorityColor(ticket.Priority)}>{ticket.Priority}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Client:</p>
                          <p className="truncate font-medium">{ticket.ClientName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Assignee:</p>
                          <p className="truncate font-medium">
                            {ticket.AssignedToUser ? ticket.AssignedUserName || "Loading..." : "Unassigned"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Created:</p>
                          <p className="font-medium">{formatDate(ticket.CreatedDatatime)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status:</p>
                          <Badge className={statusInfo.color + " whitespace-nowrap"}>
                            <span className="flex items-center gap-1 truncate">
                              {statusInfo.icon}
                              <span>{statusInfo.text}</span>
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex border-t divide-x">
                      <Link href={`/technician/tickets/${ticket.CodTicket}`} className="flex-1">
                        <Button variant="ghost" className="w-full rounded-none h-10 text-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/technician/tickets/${ticket.CodTicket}`} className="flex-1">
                        <Button variant="ghost" className="w-full rounded-none h-10 text-sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        ) : (
          <motion.div variants={itemVariants} className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Inbox className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium">No tickets found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </motion.div>

      {/* Desktop view - Table-based layout with both horizontal and vertical scrollbars */}
      <motion.div
        className="hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-md border shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] w-full">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {filteredTickets.length > 0 ? (
                  <Table className="w-full table-fixed sticky-header">
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[10%] font-semibold">Ticket ID</TableHead>
                        <TableHead className="w-[16%] font-semibold">Title</TableHead>
                        <TableHead className="w-[10%] font-semibold">Client</TableHead>
                        <TableHead className="w-[10%] font-semibold">Assignee</TableHead>
                        <TableHead className="w-[14%] font-semibold">Created</TableHead>
                        <TableHead className="w-[10%] font-semibold">Priority</TableHead>
                        <TableHead className="w-[16%] font-semibold">Status</TableHead>
                        <TableHead className="w-[8%] text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => {
                        const statusInfo = getStatusInfo(ticket.Status)
                        return (
                          <TableRow
                            key={ticket.CodTicket}
                            className="group border-b hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="w-[10%] font-medium">
                              <div className="flex items-center">
                                <div
                                  className="w-1.5 h-1.5 rounded-full mr-2"
                                  style={{
                                    backgroundColor: statusInfo.color.includes("text-")
                                      ? statusInfo.color.replace("text-", "var(--") + ")"
                                      : "var(--muted)",
                                  }}
                                ></div>
                                {ticket.CodTicket}
                              </div>
                            </TableCell>
                            <TableCell className="w-[16%] max-w-[250px] truncate font-medium" title={ticket.Title}>
                              {ticket.Title}
                            </TableCell>
                            <TableCell className="w-[10%] truncate" title={ticket.ClientName}>
                              {ticket.ClientName}
                            </TableCell>
                            <TableCell className="w-[10%] max-w-[120px]">
                              <div className="truncate" title={ticket.AssignedUserName || "Unassigned"}>
                                {ticket.AssignedToUser ? ticket.AssignedUserName || "Loading..." : "Unassigned"}
                              </div>
                            </TableCell>
                            <TableCell className="w-[14%]">{formatDate(ticket.CreatedDatatime)}</TableCell>
                            <TableCell className="w-[10%]">
                              <Badge className={getPriorityColor(ticket.Priority)}>{ticket.Priority}</Badge>
                            </TableCell>
                            <TableCell className="w-[16%]">
                              <Badge className={statusInfo.color + " whitespace-nowrap"}>
                                <span className="flex items-center gap-1 truncate">
                                  {statusInfo.icon}
                                  <span>{statusInfo.text}</span>
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[8%] text-right">
                              <Link href={`/technician/tickets/${ticket.CodTicket}`}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View ticket</span>
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Inbox className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium">No tickets found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

