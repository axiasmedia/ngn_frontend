"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DateTimePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { incidentsService } from "@/services/incidents/incidents.service"
import { useAuth } from "@/components/auth/auth-provider"
import { useTicketStatuses } from "@/hooks/useTicketStatuses" // Add this import

// Mock data for clients, products, etc.
const MOCK_CLIENTS = [
  { id: 4, name: "Chrysalis Health" },
  { id: 5, name: "Medical Center" },
  { id: 6, name: "Regional Hospital" },
]

const MOCK_PRODUCTS = [
  { id: 1, name: "Email Service" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "VPN Access" },
  { id: 4, name: "Desktop Computer" },
  { id: 5, name: "Mobile Device" },
]

const ISSUE_TYPES = [
  { id: "hardware", name: "Hardware" },
  { id: "software", name: "Software" },
  { id: "network", name: "Network" },
  { id: "access", name: "Access Rights" },
  { id: "other", name: "Other" },
]

const SUB_ISSUE_TYPES = {
  hardware: [
    { id: "laptop", name: "Laptop" },
    { id: "desktop", name: "Desktop" },
    { id: "printer", name: "Printer" },
    { id: "peripheral", name: "Peripheral" },
  ],
  software: [
    { id: "os", name: "Operating System" },
    { id: "application", name: "Application" },
    { id: "update", name: "Updates/Patches" },
  ],
  network: [
    { id: "connectivity", name: "Connectivity" },
    { id: "vpn", name: "VPN" },
    { id: "wifi", name: "WiFi" },
  ],
  access: [
    { id: "account", name: "Account" },
    { id: "permission", name: "Permission" },
    { id: "password", name: "Password" },
  ],
  other: [
    { id: "training", name: "Training" },
    { id: "inquiry", name: "Inquiry" },
  ],
}

// Update the component to use useTicketStatuses and handle email selection
export default function NewTicketPage() {
  const router = useRouter()
  const { userInfo } = useAuth()
  const { statuses, loading: statusesLoading } = useTicketStatuses() // Add this hook

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState("1") // Default to "Open"
  const [clientId, setClientId] = useState("")
  const [affectedProduct, setAffectedProduct] = useState("")
  const [issueType, setIssueType] = useState("")
  const [subIssueType, setSubIssueType] = useState("")
  const [location, setLocation] = useState("")
  const [contactMethod, setContactMethod] = useState("")
  const [contactMethodType, setContactMethodType] = useState("") // Add this state for contact method type
  const [availability, setAvailability] = useState<Date | undefined>(new Date())
  const [needsHardware, setNeedsHardware] = useState(false)
  const [assignedTo, setAssignedTo] = useState("")

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [technicians, setTechnicians] = useState<{ id: number; name: string }[]>([])

  // Load technicians
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const techs = await incidentsService.getTechnicians()
        setTechnicians(techs)
      } catch (err) {
        console.error("Failed to load technicians:", err)
      }
    }

    loadTechnicians()
  }, [])

  // Timer for duration
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  // Reset sub-issue type when issue type changes
  useEffect(() => {
    setSubIssueType("")
  }, [issueType])

  // Update the contact method when contact method type changes
  useEffect(() => {
    if (contactMethodType === "email" && userInfo?.email) {
      setContactMethod(userInfo.email)
    } else if (contactMethodType === "support1") {
      setContactMethod("support1@ngnsupport.net")
    } else if (contactMethodType === "support2") {
      setContactMethod("support2@ngnsupport.net")
    } else if (contactMethodType === "phone") {
      setContactMethod("")
    } else {
      setContactMethod("")
    }
  }, [contactMethodType, userInfo?.email])

  // Update the handleSubmit function to include the contact method
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title || !description || !clientId || !affectedProduct || !priority) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const ticketData = {
        Title: title,
        Description: description,
        ClientID: Number(clientId),
        Status: Number(status),
        Type: "TechnicianTicket", // Set type to TechnicianTicket
        AffectedProduct: Number(affectedProduct),
        Priority: priority.toLowerCase(),
        CreatedBy: userInfo?.id || 55, // Default to a technician ID if userInfo is not available
        ContactMethod: contactMethod || "support@chrysalishealth.org",
        Location: location || null,
        AssignedToUser: assignedTo ? Number(assignedTo) : null,
        Availability: availability ? availability.toISOString() : new Date().toISOString(),
        NeedHardware: needsHardware ? 1 : 0,
        IssueType: issueType || null,
        SubIssueType: subIssueType || null,
        // Include affected users array (empty for technician tickets)
        AffectedUsers: [],
      }

      console.log("Creating technician ticket:", ticketData)

      // Get files from the form
      const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
      const files = fileInput?.files ? Array.from(fileInput.files) : []

      await incidentsService.createTicket(ticketData, files)

      router.push("/technician/dashboard")
    } catch (err) {
      console.error("Error creating ticket:", err)
      setError("Failed to create ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update the Status dropdown to use the statuses from the hook
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Ticket</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Duration: {formatDuration(duration)}</span>
          <Button variant="outline" onClick={() => router.push("/technician/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" form="ticket-form">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="ticket-form" onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label htmlFor="client">
                  Client <span className="text-red-500">*</span>
                </Label>
                <Select value={clientId} onValueChange={setClientId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CLIENTS.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Add title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Priority <span className="text-red-500">*</span>
                  </Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusesLoading ? (
                        <SelectItem value="1">Loading...</SelectItem>
                      ) : statuses.length > 0 ? (
                        statuses.map((status) => (
                          <SelectItem key={status.IDStatusT} value={status.IDStatusT.toString()}>
                            {status.Description}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="1">Open</SelectItem>
                          <SelectItem value="2">In Progress</SelectItem>
                          <SelectItem value="5">Pending</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>
                  Details <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Describe the issue in detail"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Details</h2>
            <div className="space-y-6">
              {/* Assignee */}
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Unassigned</SelectItem>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id.toString()}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Affected Product */}
              <div className="space-y-2">
                <Label>
                  Affected Product <span className="text-red-500">*</span>
                </Label>
                <Select value={affectedProduct} onValueChange={setAffectedProduct} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select affected product" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PRODUCTS.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Issue Type and Sub-Issue Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Type</Label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISSUE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-Issue Type</Label>
                  <Select value={subIssueType} onValueChange={setSubIssueType} disabled={!issueType}>
                    <SelectTrigger>
                      <SelectValue placeholder={issueType ? "Select sub-issue type" : "Select issue type first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {issueType &&
                        SUB_ISSUE_TYPES[issueType as keyof typeof SUB_ISSUE_TYPES]?.map((subType) => (
                          <SelectItem key={subType.id} value={subType.id}>
                            {subType.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Enter location (e.g., Main Office, Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Contact Method - Updated to match user ticket form */}
              <div className="space-y-2">
                <Label>Contact Method</Label>
                <Select name="contact-method" value={contactMethodType} onValueChange={setContactMethodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    {userInfo?.email && <SelectItem value="email">Your Email ({userInfo.email})</SelectItem>}
                    <SelectItem value="support1">Email - Primary Support</SelectItem>
                    <SelectItem value="support2">Email - Secondary Support</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {contactMethodType === "email" && userInfo?.email && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Your email address ({userInfo.email}) will be used as the contact method.
                  </p>
                )}

                {(contactMethodType === "phone" || contactMethodType === "other") && (
                  <div className="mt-2">
                    <Input
                      placeholder={contactMethodType === "phone" ? "Enter phone number" : "Enter contact details"}
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label>Availability</Label>
                <DateTimePicker date={availability} setDate={setAvailability} />
              </div>

              {/* Hardware Needs */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="needs-hardware"
                  checked={needsHardware}
                  onChange={(e) => setNeedsHardware(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="needs-hardware" className="text-sm font-medium">
                  This ticket requires hardware or software change
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Attachments</h2>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input type="file" multiple className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-sm text-muted-foreground">
                  Drop files to attach, or <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Max file size 25MB each</p>
              </label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

