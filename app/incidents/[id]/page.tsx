"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle, Clock, CheckCircle, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { incidentsService } from "@/services/incidents/incidents.service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import api from "@/services/api"
import { useAuth } from "@/components/auth/auth-provider"
import { useTicketStatuses } from "@/hooks/useTicketStatuses"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTicketUpdates } from "@/hooks/useTicketUpdates"

export default function IncidentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const codTicket = params.id as string // This will be the CodTicket
  const { userInfo } = useAuth()

  const [incident, setIncident] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState("")
  const [submittingNote, setSubmittingNote] = useState(false)
  const [notes, setNotes] = useState<any[]>([])
  const { getStatusDescription } = useTicketStatuses()

  // Get ticket updates
  const { notes: ticketNotes, loading: notesLoading } = useTicketUpdates(codTicket)

  useEffect(() => {
    // Set the notes in the state
    setNotes(ticketNotes)
  }, [ticketNotes])

  useEffect(() => {
    // Function to safely format date strings
    const formatDateSafely = (dateString: string | null | undefined) => {
      if (!dateString) return "Not set"
      try {
        const date = new Date(dateString)
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return "Date not available"
        }
        return date.toLocaleString()
      } catch (error) {
        console.error("Error formatting date:", error)
        return "Date not available"
      }
    }

    // Function to get status string from number
    const getStatusString = (status: number) => {
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

    // Update the fetchIncident function to use the API directly for user names
    const fetchIncident = async () => {
      if (!userInfo?.id) {
        setError("User information not available")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Use the same endpoint as the list page, but filter for the specific ticket
        const response = await api.get(`/ticket/by-user/${userInfo.id}`)

        if (response.data && Array.isArray(response.data)) {
          // Find the specific ticket with matching CodTicket
          const ticketData = response.data.find((ticket) => ticket.CodTicket === codTicket)

          if (ticketData) {
            // Get creator's name from API
            let creatorName = "Unknown"
            let assigneeName = "Unassigned"

            try {
              if (ticketData.CreatedBy) {
                const creatorResponse = await api.get(`/ticket/user/${ticketData.CreatedBy}`)
                if (creatorResponse.data && creatorResponse.data.length > 0) {
                  const creator = creatorResponse.data[0]
                  creatorName =
                    `${creator.FirstName || ""} ${creator.LastName || ""}`.trim() ||
                    creator.Username ||
                    `User ${ticketData.CreatedBy}`
                }
              }

              if (ticketData.AssignedToUser) {
                const assigneeResponse = await api.get(`/ticket/user/${ticketData.AssignedToUser}`)
                if (assigneeResponse.data && assigneeResponse.data.length > 0) {
                  const assignee = assigneeResponse.data[0]
                  assigneeName =
                    `${assignee.FirstName || ""} ${assignee.LastName || ""}`.trim() ||
                    assignee.Username ||
                    `User ${ticketData.AssignedToUser}`
                }
              }
            } catch (userError) {
              console.error("Error fetching user details:", userError)
            }

            // Format the ticket data for our UI
            setIncident({
              id: ticketData.CodTicket,
              codTicket: ticketData.CodTicket,
              title: ticketData.Title || "No Title",
              description: ticketData.Description || "No description available",
              status: ticketData.Status || "Unknown",
              priority: ticketData.Priority || "Medium",
              createdBy: creatorName, // Use name from API
              createdById: ticketData.CreatedBy, // Keep the ID for reference
              assignee: assigneeName, // Use name from API
              openDate: formatDateSafely(ticketData.CreatedDatatime),
              dueDate: formatDateSafely(ticketData.DueDate),
              account: "Chrysalis Health",
              contract: "Standard Support",
              notes: ticketData.Notes || [],
              createdAt: ticketData.CreatedDatatime,
              updatedAt: ticketData.DueDatetime,
            })
          } else {
            setError(`Ticket ${codTicket} not found`)
          }
        } else {
          // Fallback to the mock implementation if API doesn't return data
          const data = await incidentsService.getIncidentById(codTicket)
          setIncident(data)
        }
      } catch (err) {
        console.error("Error fetching ticket:", err)

        // Try the mock service as fallback
        try {
          const data = await incidentsService.getIncidentById(codTicket)
          setIncident(data)
        } catch (fallbackErr) {
          setError("Failed to load incident details")
          console.error("Fallback error:", fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchIncident()
  }, [codTicket, userInfo])

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      setSubmittingNote(true)
      const note = await incidentsService.addNote(codTicket, newNote)

      // Update the incident with the new note
      setIncident((prev: any) => ({
        ...prev,
        notes: [...(prev.notes || []), note],
      }))

      setNewNote("")
    } catch (err) {
      console.error("Failed to add note:", err)
    } finally {
      setSubmittingNote(false)
    }
  }

  // Function to get status icon
  const getStatusIcon = (status: string | number) => {
    // Convert string status to number if needed
    const statusId = typeof status === "string" ? Number.parseInt(status) : typeof status === "number" ? status : 0

    switch (statusId) {
      case 1:
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 2:
        return <Clock className="h-5 w-5 text-amber-500" />
      case 3:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 4:
        return <CheckCircle className="h-5 w-5 text-gray-500" />
      case 5:
        return <Clock className="h-5 w-5 text-purple-500" />
      case 6:
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  // Function to get status color
  const getStatusColor = (status: string | number) => {
    // Convert string status to number if needed
    const statusId = typeof status === "string" ? Number.parseInt(status) : typeof status === "number" ? status : 0

    switch (statusId) {
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
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading incident details...</span>
        </div>
      </div>
    )
  }

  if (error || !incident) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href="/incidents/list">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to incidents
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Failed to load incident details. Please try again later."}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/incidents/list">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to incidents
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-xl">Ticket #{incident.codTicket}</CardTitle>
              <div className="flex items-center gap-3">
                <Badge className={getPriorityColor(incident.priority)}>{incident.priority}</Badge>
                <Badge className={getStatusColor(incident.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(incident.status)}
                    {typeof incident.status === "number" ? getStatusDescription(incident.status) : incident.status}
                  </span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">{incident.title}</h2>
            <p className="text-muted-foreground mb-6">{incident.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                <p>{incident.createdBy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Assignee</h3>
                <p>{incident.assignee}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Open Date</h3>
                <p>{incident.openDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p>{incident.dueDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
                <p>{incident.account}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contract</h3>
                <p>{incident.contract}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Notes & Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScrollArea className="h-[300px] pr-4">
                {notes && notes.length > 0 ? (
                  <div className="space-y-4">
                   {notes.map((note: any) => (
                      <div key={note.id} className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                        <p className="text-sm">{note.text}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{note.createdBy}</span>
                          <span>•</span>
                          <span>{note.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No notes or activity yet.</p>
                )}
              </ScrollArea>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Add a note</h3>
                <Textarea
                  placeholder="Type your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim() || submittingNote} className="mt-2">
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

