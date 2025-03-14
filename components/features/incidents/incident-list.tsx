"use client"

import { useState } from "react"
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
  Inbox,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIncidents } from "@/hooks/useIncidents"
import { useAuth } from "@/components/auth/auth-provider"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function IncidentList() {
  const { userInfo } = useAuth()
  const { incidents, loading, error, refetch } = useIncidents(userInfo?.id)
  const { statuses, getStatusDescription } = useTicketStatuses()

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter incidents based on search query and filters
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      searchQuery === "" ||
      incident.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.CodTicket.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || incident.Status.toString() === statusFilter

    const matchesPriority = priorityFilter === "all" || incident.Priority.toLowerCase() === priorityFilter.toLowerCase()

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
        <p>Loading incidents...</p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Error loading incidents</h3>
            <p className="text-muted-foreground">{error}</p>
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No incidents found</h3>
            <p className="text-muted-foreground mb-6">You don't have any reported incidents yet.</p>
            <Link href="/incidents">
              <Button>Report New Incident</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
            placeholder="Search incidents..."
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
            {/* Get unique status IDs from incidents */}
            {Array.from(new Set(incidents.map((incident) => incident.Status)))
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

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <motion.div className="space-y-4 pb-4" variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence>
            {filteredIncidents.map((incident) => (
              <motion.div key={incident.CodTicket} variants={itemVariants} layout exit={{ opacity: 0, y: -20 }}>
                <Card className="hover:shadow-md transition-shadow">
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
                          <Badge className={getPriorityColor(incident.Priority)}>
                            {incident.Priority.charAt(0).toUpperCase() + incident.Priority.slice(1)}
                          </Badge>
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
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredIncidents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No matching incidents</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </ScrollArea>
    </motion.div>
  )
}

