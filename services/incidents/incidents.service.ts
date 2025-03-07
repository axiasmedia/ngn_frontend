import api from "@/services/api"
import type { Incident, IncidentDetail, IncidentNote, CreateTicketPayload } from "./types"

export const incidentsService = {
  /**
   * Get all incidents for the current user
   */
  getIncidents: async (userId: number): Promise<Incident[]> => {
    try {
      const response = await api.get<Incident[]>(`/ticket/by-user/${userId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching incidents:", error)
      throw error
    }
  },

  /**
   * Get incident details by ID
   */
  getIncidentById: async (id: string): Promise<IncidentDetail> => {
    // In a real app, this would be an API call
    // const response = await api.get<IncidentDetail>(`/incidents/${id}`)
    // return response.data

    // Mock data for now
    return {
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
      requiresChange: false,
      assignType: "technician",
      assignedTo: "",
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
      createdAt: "2025-01-25T17:24:00Z",
      updatedAt: "2025-01-25T18:15:00Z",
    }
  },

  /**
   * Add a note to an incident
   */
  addNote: async (incidentId: string, text: string): Promise<IncidentNote> => {
    // In a real app, this would be an API call
    // const response = await api.post<IncidentNote>(`/incidents/${incidentId}/notes`, { text })
    // return response.data

    // Mock response for now
    return {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toLocaleString(),
      createdBy: "Tech Support Team",
    }
  },

  /**
   * Update incident status
   */
  updateStatus: async (incidentId: string, status: string, note: string): Promise<void> => {
    // In a real app, this would be an API call
    // await api.patch(`/incidents/${incidentId}/status`, { status, note })

    // Mock implementation - no action needed for mock
    console.log(`Updated incident ${incidentId} status to ${status} with note: ${note}`)
  },

  createTicket: async (ticket: CreateTicketPayload, files?: File[]): Promise<void> => {
    try {
      console.log("Sending ticket data:", ticket)

      // Create FormData instance
      const formData = new FormData()

      // Add the ticket data as a JSON string in the body field
      formData.append("body", JSON.stringify(ticket))

      // Add files if they exist
      if (files && files.length > 0) {
        files.forEach((file) => {
          // Use 'files' as the field name to match the FilesInterceptor
          formData.append("files", file)
        })
      }

      console.log("Sending FormData with files:", files?.length || 0, "files")

      const response = await api.post("/ticket/create", formData, {
        headers: {
          // Let the browser set the Content-Type header for FormData
          Accept: "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error creating ticket:", error)
      throw error
    }
  },
  // Mock data for development
  getUsers: async () => {
    return [
      { id: 45, name: "John Doe", email: "john@example.com" },
      { id: 46, name: "Jane Smith", email: "jane@example.com" },
      { id: 47, name: "Bob Wilson", email: "bob@example.com" },
    ]
  },

  getProducts: async () => {
    return [
      { id: 1, name: "Email Service", type: "Software" },
      { id: 2, name: "Laptop", type: "Hardware" },
      { id: 3, name: "VPN Access", type: "Network" },
    ]
  },
}

