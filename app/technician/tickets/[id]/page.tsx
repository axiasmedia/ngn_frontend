"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Note {
  id: string
  text: string
  createdAt: string
  createdBy: string
}

// Mock ticket data - in a real app, this would come from an API
const mockTicket = {
  id: "40-29012025",
  title: "Email not working",
  description: "User cannot access their email account",
  account: "Chrysalis Health",
  contract: "Chrysalis Support",
  owner: "John Smith",
  openDate: "25/01/2025 05:24 PM",
  dueDate: "27/01/2025 05:24 PM",
  createdBy: "Sarah Johnson",
  assignee: "Tech Support Team",
  priority: "High",
  status: "Open",
  notes: [
    {
      id: "1",
      text: "Initial investigation started. Checking email server logs.",
      createdAt: "25/01/2025 05:30 PM",
      createdBy: "Tech Support Team",
    },
    {
      id: "2",
      text: "Found issue with account permissions. Working on fix.",
      createdAt: "25/01/2025 06:15 PM",
      createdBy: "Tech Support Team",
    },
  ],
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState(mockTicket)
  const [notes, setNotes] = useState<Note[]>(mockTicket.notes)
  const [newNote, setNewNote] = useState("")
  const [newStatus, setNewStatus] = useState(ticket.status)
  const [statusNote, setStatusNote] = useState("")
  const [statusError, setStatusError] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const note = {
      id: Date.now().toString(),
      text: newNote,
      createdAt: new Date().toLocaleString(),
      createdBy: "Tech Support Team",
    }

    setNotes([...notes, note])
    setNewNote("")
  }

  const handleStatusChange = () => {
    if (!statusNote.trim()) {
      setStatusError(true)
      return
    }

    // Add the status change note
    const statusChangeNote = {
      id: Date.now().toString(),
      text: `Status changed from "${ticket.status}" to "${newStatus}": ${statusNote}`,
      createdAt: new Date().toLocaleString(),
      createdBy: "Tech Support Team",
    }

    // Update ticket status and add the note
    setTicket({ ...ticket, status: newStatus })
    setNotes([...notes, statusChangeNote])

    // Reset form
    setStatusNote("")
    setStatusError(false)
    setIsStatusDialogOpen(false)
  }

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <CardTitle>Ticket #{ticket.id}</CardTitle>
              <div className="flex items-center gap-4">
                <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Status</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Ticket Status</DialogTitle>
                      <DialogDescription>Change the status of ticket #{ticket.id}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Status</label>
                        <div className="px-3 py-2 border rounded-md bg-muted">{ticket.status}</div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Status</label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
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
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold">{ticket.title}</h3>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Account</p>
                  <p className="text-sm text-muted-foreground">{ticket.account}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contract</p>
                  <p className="text-sm text-muted-foreground">{ticket.contract}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Owner</p>
                  <p className="text-sm text-muted-foreground">{ticket.owner}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Assignee</p>
                  <p className="text-sm text-muted-foreground">{ticket.assignee}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Open Date</p>
                  <p className="text-sm text-muted-foreground">{ticket.openDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-muted-foreground">{ticket.dueDate}</p>
                </div>
              </div>
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
                {notes.map((note) => (
                  <div key={note.id} className="rounded-lg border p-4">
                    <p className="text-sm">{note.text}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{note.createdBy}</span>
                      <span>•</span>
                      <span>{note.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                <Button onClick={handleAddNote}>Add Note</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

