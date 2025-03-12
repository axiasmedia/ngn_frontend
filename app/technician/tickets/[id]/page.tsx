"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  CheckCircle,
  Loader2,
  Info,
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
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import api from "@/services/api"
import { userService } from "@/services/user/user.service"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"
import { incidentsService } from "@/services/incidents/incidents.service"
import { useTicketUpdates } from "@/hooks/useTicketUpdates"
import { AssignTechnicianDialog } from "@/components/features/technician/assign-technician-dialog"

interface Note {
  id: string
  text: string
  createdAt: string
  createdBy: string
}

interface Ticket {
  IDTicket: number
  CodTicket: string
  ClientID: number
  ClientName?: string
  Title: string
  Description: string
  Status: number
  Type: string
  AffectedProduct: number
  Priority: string
  CreatedBy: number
  CreatedByName?: string
  ContactMethod: string
  Location: string | null
  AssignedToUser: number | null
  AssignedUserName?: string
  Availability: string
  CreatedDatatime: string
  ModDatetime: string | null
  AssignedHWMS: number | null
  AssignedVendor: number | null
  NeedHardware: number
  IssueType: string | null
  SubIssueType: string | null
  notes?: Note[]
  requiresChange?: boolean
  assignType?: string
  assignedTo?: string
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const codTicket = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [newStatus, setNewStatus] = useState<number>(1)
  const [statusNote, setStatusNote] = useState("")
  const [statusError, setStatusError] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [requiresChange, setRequiresChange] = useState(false)
  const [assignType, setAssignType] = useState<string>("technician")
  const [assignedTo, setAssignedTo] = useState<string>("")
  const [submittingNote, setSubmittingNote] = useState(false)
  const [hardwareTechnicians, setHardwareTechnicians] = useState<{ id: number; name: string }[]>([])
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([])
  const [loadingHardwareOptions, setLoadingHardwareOptions] = useState(false)
  const { statuses, getStatusDescription } = useTicketStatuses()
  const { notes: ticketNotes, loading: notesLoading } = useTicketUpdates(codTicket)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)

        // Fetch all tickets from the queue
        const response = await api.get("/ticket/queu")

        if (response.data && Array.isArray(response.data)) {
          // Find the specific ticket with matching CodTicket
          const ticketData = response.data.find((t: Ticket) => t.CodTicket === codTicket)

          if (ticketData) {
            // Get creator name
            let creatorName = "Unknown"
            if (ticketData.CreatedBy) {
              try {
                creatorName = await userService.getUserName(ticketData.CreatedBy)
              } catch (err) {
                console.error("Error fetching creator name:", err)
              }
            }

            // Get assignee name if assigned
            let assigneeName = "Unassigned"
            if (ticketData.AssignedToUser) {
              try {
                assigneeName = await userService.getUserName(ticketData.AssignedToUser)
              } catch (err) {
                console.error("Error fetching assignee name:", err)
              }
            }

            // Set the ticket with additional information
            const enrichedTicket = {
              ...ticketData,
              CreatedByName: creatorName,
              AssignedUserName: assigneeName,
              notes: ticketData.notes || [],
            }

            setTicket(enrichedTicket)
            setNotes(enrichedTicket.notes || [])
            setNewStatus(enrichedTicket.Status)
            setRequiresChange(!!enrichedTicket.NeedHardware)

            // Set the notes in the state
            setNotes(ticketNotes)
          } else {
            setError(`Ticket ${codTicket} not found`)
          }
        } else {
          setError("Invalid response format from API")
        }
      } catch (err) {
        console.error("Error fetching ticket:", err)
        setError("Failed to load ticket details")
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [codTicket, ticketNotes])

  useEffect(() => {
    const loadHardwareOptions = async () => {
      try {
        setLoadingHardwareOptions(true)
        const [techsData, vendorsData] = await Promise.all([
          incidentsService.getHardwareTechnicians(),
          incidentsService.getVendors(),
        ])
        setHardwareTechnicians(techsData)
        setVendors(vendorsData)
      } catch (err) {
        console.error("Error loading hardware options:", err)
      } finally {
        setLoadingHardwareOptions(false)
      }
    }

    loadHardwareOptions()
  }, [])

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      setSubmittingNote(true)

      // In a real implementation, this would be an API call
      // await api.post(`/ticket/${codTicket}/notes`, { text: newNote })

      const note = {
        id: Date.now().toString(),
        text: newNote,
        createdAt: new Date().toLocaleString(),
        createdBy: "Tech Support Team",
      }

      setNotes([...notes, note])
      setNewNote("")
    } catch (err) {
      console.error("Failed to add note:", err)
    } finally {
      setSubmittingNote(false)
    }
  }

  const getStatusText = (status: number): string => {
    // First try to get the status from our fetched statuses
    const statusDescription = getStatusDescription(status)
    if (statusDescription !== "Unknown") {
      return statusDescription
    }

    // Fallback to the hardcoded mapping if needed
    switch (status) {
      case 1:
        return "Open"
      case 2:
        return "In Progress"
      case 3:
        return "Resolved"
      case 4:
        return "Closed"
      default:
        return "Unknown"
    }
  }

  // Update the handleStatusChange function to properly call the API with the correct status ID
  const handleStatusChange = async () => {
    if (!statusNote.trim()) {
      setStatusError(true)
      return
    }

    try {
      // Call the API to update the status
      await incidentsService.updateStatus(codTicket, newStatus, statusNote)

      // Add the status change note
      const statusChangeNote = {
        id: Date.now().toString(),
        text: `Status changed from "${getStatusText(ticket?.Status || 1)}" to "${getStatusText(newStatus)}": ${statusNote}`,
        createdAt: new Date().toLocaleString(),
        createdBy: "Tech Support Team",
      }

      // Update ticket status and add the note
      if (ticket) {
        setTicket({ ...ticket, Status: newStatus })
      }
      setNotes([...notes, statusChangeNote])

      // Reset form
      setStatusNote("")
      setStatusError(false)
      setIsStatusDialogOpen(false)
    } catch (err) {
      console.error("Failed to update status:", err)
      // You could add error handling here, like showing an error message
    }
  }

  const handleHardwareChange = async () => {
    if (!ticket) return

    try {
       // If hardware is not required, just update the UI
       if (!requiresChange) {
        // Add a note about the hardware change
        const hardwareNote = {
          id: Date.now().toString(),
          text: "Ticket marked as not requiring hardware/software change.",
          createdAt: new Date().toLocaleString(),
          createdBy: "Tech Support Team",
        }

        // Update ticket and add note
        setTicket({
          ...ticket,
          NeedHardware: 0,
          assignType: undefined,
          assignedTo: undefined,
        })
        setNotes([...notes, hardwareNote])
        setTimeout(() => {
          window.location.reload()
        }, 500)
        return
      }

      // Validate selection
      if (!assignedTo) {
        setError("Please select a technician or vendor")
        return
      }

      // Determine the type of assignment and ID
      const needHardware = assignType === "technician" ? 1 : 2
      const assignedId = Number(assignedTo)

      // Call the API to assign hardware
      await incidentsService.assignHardware(codTicket, needHardware, assignedId)

      // Get the name of the assigned entity
      const assigneeName =
        assignType === "technician"
           ? hardwareTechnicians.find((t) => t.id === assignedId)?.name || `Technician ${assignedId}`
          : vendors.find((v) => v.id === assignedId)?.name || `Vendor ${assignedId}`

      // Add a note about the hardware change
      const hardwareNote = {
        id: Date.now().toString(),
        text: `Ticket marked as requiring hardware/software change. Assigned to ${assignType} ${assigneeName}.`,
        createdAt: new Date().toLocaleString(),
        createdBy: "Tech Support Team",
      }

      // Update ticket and add note
      setTicket({
        ...ticket,
        NeedHardware: needHardware,
        assignType: assignType,
        assignedTo: assignedTo,
      })
      // Clear any previous errors
      setNotes([...notes, hardwareNote])
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err) {
      console.error("Failed to update hardware requirements:", err)
      setError("Failed to assign hardware. Please try again.")
    }
  }

  // Helper functions for status and priority display

  const getStatusColor = (status: number): string => {
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

  // Update the getStatusIcon function to handle all the new icons
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
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string): string => {
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

  // Format date for display
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not set"
    try {
      return new Date(dateString).toLocaleString()
    } catch (error) {
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading ticket details...</span>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href="/technician/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tickets
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Failed to load ticket details. Please try again later."}</AlertDescription>
        </Alert>
      </div>
    )
  }
  const handleRefresh = () => {
    window.location.reload()
  }
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/technician/dashboard">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tickets
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ticket #{ticket.CodTicket}</CardTitle>
              <div className="flex items-center gap-4">
                <Badge className={getPriorityColor(ticket.Priority)}>{ticket.Priority}</Badge>
                <Badge className={getStatusColor(ticket.Status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(ticket.Status)}
                    {getStatusText(ticket.Status)}
                  </span>
                </Badge>
                <AssignTechnicianDialog
                  ticketId={ticket.CodTicket}
                  currentTechnicianId={ticket.AssignedToUser}
                  onAssigned={handleRefresh}
                />
                <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Status</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Ticket Status</DialogTitle>
                      <DialogDescription>Change the status of ticket #{ticket.CodTicket}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Status</label>
                        <div className="px-3 py-2 border rounded-md bg-muted">{getStatusText(ticket.Status)}</div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Status</label>
                        <Select value={newStatus.toString()} onValueChange={(value) => setNewStatus(Number(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.length > 0 ? (
                              statuses.map((status) => (
                                <SelectItem
                                  key={typeof status.IDStatusT !== "undefined" ? status.IDStatusT : Math.random()}
                                  value={typeof status.IDStatusT !== "undefined" ? status.IDStatusT.toString() : "0"}
                                >
                                  {status.Description || "Unknown Status"}
                                </SelectItem>
                              ))
                            ) : (
                              // Fallback options if statuses haven't loaded
                              <>
                                <SelectItem value="1">Open</SelectItem>
                                <SelectItem value="2">In Progress</SelectItem>
                                <SelectItem value="3">Resolved</SelectItem>
                                <SelectItem value="4">Closed</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Reason for Status Change <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          placeholder="Explain why you're changing the status..."
                          value={statusNote}
                          onChange={(e) => {
                            setStatusNote(e.target.value)
                            if (statusError) setStatusError(false)
                          }}
                          className={statusError ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {statusError && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>Please provide a reason for the status change</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStatusNote("")
                          setStatusError(false)
                          setIsStatusDialogOpen(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleStatusChange}>Update Status</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-semibold">{ticket.Title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{ticket.Description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Client</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.ClientName || `Client ID: ${ticket.ClientID}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">{ticket.Type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.CreatedByName || `User ID: ${ticket.CreatedBy}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-muted-foreground">{ticket.AssignedUserName || "Unassigned"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(ticket.CreatedDatatime)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Modified</p>
                  <p className="text-sm text-muted-foreground">{formatDate(ticket.ModDatetime) || "Not modified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Availability</p>
                  <p className="text-sm text-muted-foreground">{formatDate(ticket.Availability)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Method</p>
                  <p className="text-sm text-muted-foreground">{ticket.ContactMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{ticket.Location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Affected Product</p>
                  <p className="text-sm text-muted-foreground">Product ID: {ticket.AffectedProduct}</p>
                </div>
                {ticket.IssueType && (
                  <div>
                    <p className="text-sm font-medium">Issue Type</p>
                    <p className="text-sm text-muted-foreground">{ticket.IssueType}</p>
                  </div>
                )}
                {ticket.SubIssueType && (
                  <div>
                    <p className="text-sm font-medium">Sub-Issue Type</p>
                    <p className="text-sm text-muted-foreground">{ticket.SubIssueType}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hardware/Software Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Hardware/Software Change Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hw-sw-change"
                  checked={requiresChange}
                  onCheckedChange={(checked) => {
                    setRequiresChange(checked === true)
                  }}
                />
                <label
                  htmlFor="hw-sw-change"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This ticket requires hardware or software change
                </label>
              </div>

              {/* Assignment Options - Only show if checkbox is checked */}
              {requiresChange && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assign to</Label>
                    <RadioGroup
                      value={assignType}
                      onValueChange={(value) => {
                        setAssignType(value)
                        setAssignedTo("") // Reset selection when changing type
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technician" id="technician" />
                        <Label htmlFor="technician">Hardware Technician</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vendor" id="vendor" />
                        <Label htmlFor="vendor">Vendor</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {assignType === "technician" && (
                    <div className="space-y-2">
                       <Label>Select Hardware Technician</Label>
                      {loadingHardwareOptions ? (
                        <div className="flex items-center space-x-2 py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Loading technicians...</span>
                        </div>
                      ) : (
                      <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a hardware technician" />
                        </SelectTrigger>
                        <SelectContent>
                        {hardwareTechnicians.length > 0 ? (
                              hardwareTechnicians.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id.toString()}>
                                  {tech.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="0" disabled>
                                No technicians available
                              </SelectItem>
                            )}
                        </SelectContent>
                      </Select>
                      )}
                    </div>
                  )}
                  {assignType === "vendor" && (
                    <div className="space-y-2">
                      <Label>Select Vendor</Label>
                      {loadingHardwareOptions ? (
                        <div className="flex items-center space-x-2 py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Loading vendors...</span>
                        </div>
                      ) : (
                      <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vendor" />
                        </SelectTrigger>
                        <SelectContent>
                        {vendors.length > 0 ? (
                              vendors.map((vendor) => (
                                <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                  {vendor.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="0" disabled>
                                No vendors available
                              </SelectItem>
                            )}
                        </SelectContent>
                      </Select>
                       )}
                    </div>
                  )}

                  {/* Shared Status */}
                  {assignedTo && (
                    <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Ticket Will Be Shared</AlertTitle>
                      <AlertDescription>
                        This ticket will be shared with {assignType === "technician" ? "technician" : "vendor"}:{" "}
                        {assignType === "technician"
                         ? hardwareTechnicians.find((t) => t.id === Number(assignedTo))?.name ||
                         `Technician ${assignedTo}`
                       : vendors.find((v) => v.id === Number(assignedTo))?.name || `Vendor ${assignedTo}`}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Save Button */}
                  <Button onClick={handleHardwareChange}>Save Changes</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note.id} className="rounded-lg border p-4">
                      <p className="text-sm">{note.text}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{note.createdBy}</span>
                        <span>•</span>
                        <span>{note.createdAt}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No notes available for this ticket.</p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="new-note">Add a note</Label>
                <Textarea
                  id="new-note"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim() || submittingNote}>
                  {submittingNote && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

