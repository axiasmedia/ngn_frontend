"use client"

import { useState } from "react"
import Link from "next/link"
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
  Loader2,
  Search,
  Filter,
  SlidersHorizontal,
  TicketIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { useIncidents } from "@/hooks/useIncidents"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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

interface UserTicketsProps {
  userId: string
  userName?: string
}

export function UserTickets({ userId, userName }: UserTicketsProps) {
  // Convert userId to number if it's a string
  const userIdNum = Number.parseInt(userId, 10)

  // Use the hooks to fetch data - pass the numeric user ID directly
  const { incidents, loading, error, refetch } = useIncidents(userIdNum)
  const { statuses, getStatusDescription } = useTicketStatuses()

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Filter incidents based on search query and filters
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      searchQuery === "" ||
      incident.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      incident.CodTicket?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false

    const matchesStatus = statusFilter === "all" || incident.Status?.toString() === statusFilter

    const matchesPriority =
      priorityFilter === "all" || incident.Priority?.toLowerCase() === priorityFilter.toLowerCase() || false

    return matchesSearch && matchesStatus && matchesPriority
  })

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
        return <RefreshCcw className="h-4 w-4" />
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
      case "new":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
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

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading tickets...</p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-xl font-medium mb-2">Error loading tickets</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">{error}</p>
            <Button onClick={() => refetch()} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!incidents || incidents.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <TicketIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tickets found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {userName ? `${userName} hasn't submitted any tickets yet.` : "No tickets found for this user."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6">
          {/* Update the filter controls section to fix the spacing issue with the status select */}
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-10 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] truncate">
                  <div className="flex items-center gap-2 truncate">
                    <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <SelectValue placeholder="Filter by status" className="truncate" />
                  </div>
                </SelectTrigger>
                <SelectContent align="start" className="w-[180px]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {/* Get unique status IDs from incidents */}
                  {Array.from(new Set(incidents.map((incident) => incident.Status)))
                    .filter(Boolean)
                    .sort((a, b) => a - b)
                    .map((statusId) => (
                      <SelectItem key={statusId} value={statusId.toString()}>
                        {getStatusDescription(statusId)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[180px] truncate">
                  <div className="flex items-center gap-2 truncate">
                    <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <SelectValue placeholder="Filter by priority" className="truncate" />
                  </div>
                </SelectTrigger>
                <SelectContent align="start" className="w-[180px]">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
            <motion.div className="space-y-4 pb-4" variants={containerVariants} initial="hidden" animate="visible">
              <AnimatePresence>
                {filteredIncidents.map((incident) => (
                  <motion.div key={incident.CodTicket} variants={itemVariants} layout exit={{ opacity: 0, y: -20 }}>
                    <Card
                      className="overflow-hidden transition-all hover:shadow-md border-l-4"
                      style={{
                        borderLeftColor: getStatusColor(incident.Status).includes("bg-")
                          ? `var(--${getStatusColor(incident.Status).split("bg-")[1].split(" ")[0].replace("100", "500")})`
                          : "var(--border)",
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{getStatusDescription(incident.Status)}</span>
                              </div>
                              {incident.Priority && (
                                <Badge
                                  variant="outline"
                                  className={`${getPriorityColor(incident.Priority)} border-none`}
                                >
                                  {incident.Priority.charAt(0).toUpperCase() + incident.Priority.slice(1)}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-lg">
                              <Link
                                href={`/technician/tickets/${incident.CodTicket}`}
                                className="hover:text-primary hover:underline"
                              >
                                {incident.Title || `Ticket #${incident.CodTicket}`}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <TicketIcon className="h-3.5 w-3.5" />
                              Ticket ID: {incident.CodTicket}
                            </p>
                            {incident.Description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{incident.Description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-3">
                              <p className="flex items-center justify-end gap-1 mb-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Created:</span>
                                <span className="font-medium">{formatDate(incident.CreatedDatatime)}</span>
                              </p>
                              <p className="flex items-center justify-end gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Updated:</span>
                                <span className="font-medium">{formatDate(incident.DueDatetime)}</span>
                              </p>
                            </div>
                            <Link href={`/technician/tickets/${incident.CodTicket}`}>
                              <Button size="sm" className="flex items-center gap-1">
                                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredIncidents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg"
                >
                  <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No matching tickets</h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-md">
                    Try adjusting your search or filters to find what you're looking for
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="open" className="mt-0">
          <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
            <motion.div className="space-y-4 pb-4" variants={containerVariants} initial="hidden" animate="visible">
              <AnimatePresence>
                {filteredIncidents.map((incident) => (
                  <motion.div key={incident.CodTicket} variants={itemVariants} layout exit={{ opacity: 0, y: -20 }}>
                    <Card
                      className="overflow-hidden transition-all hover:shadow-md border-l-4"
                      style={{
                        borderLeftColor: getStatusColor(incident.Status).includes("bg-")
                          ? `var(--${getStatusColor(incident.Status).split("bg-")[1].split(" ")[0].replace("100", "500")})`
                          : "var(--border)",
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{getStatusDescription(incident.Status)}</span>
                              </div>
                              {incident.Priority && (
                                <Badge
                                  variant="outline"
                                  className={`${getPriorityColor(incident.Priority)} border-none`}
                                >
                                  {incident.Priority.charAt(0).toUpperCase() + incident.Priority.slice(1)}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-lg">
                              <Link
                                href={`/technician/tickets/${incident.CodTicket}`}
                                className="hover:text-primary hover:underline"
                              >
                                {incident.Title || `Ticket #${incident.CodTicket}`}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <TicketIcon className="h-3.5 w-3.5" />
                              Ticket ID: {incident.CodTicket}
                            </p>
                            {incident.Description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{incident.Description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-3">
                              <p className="flex items-center justify-end gap-1 mb-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Created:</span>
                                <span className="font-medium">{formatDate(incident.CreatedDatatime)}</span>
                              </p>
                              <p className="flex items-center justify-end gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Updated:</span>
                                <span className="font-medium">{formatDate(incident.DueDatetime)}</span>
                              </p>
                            </div>
                            <Link href={`/technician/tickets/${incident.CodTicket}`}>
                              <Button size="sm" className="flex items-center gap-1">
                                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredIncidents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg"
                >
                  <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No open tickets found</h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-md">
                    There are no open tickets matching your current filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="closed" className="mt-0">
          <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
            <motion.div className="space-y-4 pb-4" variants={containerVariants} initial="hidden" animate="visible">
              <AnimatePresence>
                {filteredIncidents.map((incident) => (
                  <motion.div key={incident.CodTicket} variants={itemVariants} layout exit={{ opacity: 0, y: -20 }}>
                    <Card
                      className="overflow-hidden transition-all hover:shadow-md border-l-4"
                      style={{
                        borderLeftColor: getStatusColor(incident.Status).includes("bg-")
                          ? `var(--${getStatusColor(incident.Status).split("bg-")[1].split(" ")[0].replace("100", "500")})`
                          : "var(--border)",
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{getStatusDescription(incident.Status)}</span>
                              </div>
                              {incident.Priority && (
                                <Badge
                                  variant="outline"
                                  className={`${getPriorityColor(incident.Priority)} border-none`}
                                >
                                  {incident.Priority.charAt(0).toUpperCase() + incident.Priority.slice(1)}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-lg">
                              <Link
                                href={`/technician/tickets/${incident.CodTicket}`}
                                className="hover:text-primary hover:underline"
                              >
                                {incident.Title || `Ticket #${incident.CodTicket}`}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <TicketIcon className="h-3.5 w-3.5" />
                              Ticket ID: {incident.CodTicket}
                            </p>
                            {incident.Description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{incident.Description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-3">
                              <p className="flex items-center justify-end gap-1 mb-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Created:</span>
                                <span className="font-medium">{formatDate(incident.CreatedDatatime)}</span>
                              </p>
                              <p className="flex items-center justify-end gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Updated:</span>
                                <span className="font-medium">{formatDate(incident.DueDatetime)}</span>
                              </p>
                            </div>
                            <Link href={`/technician/tickets/${incident.CodTicket}`}>
                              <Button size="sm" className="flex items-center gap-1">
                                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredIncidents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg"
                >
                  <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No closed tickets found</h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-md">
                    There are no closed tickets matching your current filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

