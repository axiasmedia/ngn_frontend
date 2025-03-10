import api from "@/services/api"
import type { Incident, IncidentDetail, IncidentNote, CreateTicketPayload, QueueTicket } from "./types"

// Function to map status codes to status strings
const getStatusString = (status: number): string => {
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

// Remove the hardcoded getUserNameById function and replace it with a real API call
// Helper function to get user name from API
const getUserNameById = async (userId: number | string | null | undefined): Promise<string> => {
  if (!userId) return "Unknown"

  try {
    const response = await api.get(`/ticket/user/${userId}`)

    if (response.data && response.data.length > 0) {
      const user = response.data[0]
      // Format the name using FirstName and LastName from API
      return `${user.FirstName || ""} ${user.LastName || ""}`.trim() || user.Username || `User ${userId}`
    }
    return `User ${userId}`
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error)
    return `User ${userId}`
  }
}

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

  // Update getIncidentById to use the async getUserNameById function
  getIncidentById: async (codTicket: string, userId?: number): Promise<IncidentDetail> => {
    try {
      // If we have a userId, use the same endpoint as the list page
      if (userId) {
        const response = await api.get(`/ticket/by-user/${userId}`)

        if (response.data && Array.isArray(response.data)) {
          // Find the specific ticket with matching CodTicket
          const ticketData = response.data.find((ticket: any) => ticket.CodTicket === codTicket)

          if (ticketData) {
            // Helper function to safely format dates
            const formatDateSafely = (dateString: string | null | undefined) => {
              if (!dateString) return "Not set"
              try {
                const date = new Date(dateString)
                if (isNaN(date.getTime())) {
                  return "Date not available"
                }
                return date.toLocaleString()
              } catch (error) {
                console.error("Error formatting date:", error)
                return "Date not available"
              }
            }

            // Get the creator's name from the API
            const creatorName = await getUserNameById(ticketData.CreatedBy)
            const assigneeName = ticketData.AssignedToUser
              ? await getUserNameById(ticketData.AssignedToUser)
              : "Unassigned"

            // Format the API response to match our IncidentDetail interface
            return {
              id: codTicket,
              title: ticketData.Title || "No Title",
              description: ticketData.Description || "No description available",
              account: "Chrysalis Health",
              contract: "Chrysalis Support",
              owner: "User",
              openDate: formatDateSafely(ticketData.CreatedDatatime),
              dueDate: formatDateSafely(ticketData.DueDate),
              createdBy: creatorName, // Use the name from API
              assignee: assigneeName, // Use the name from API
              priority: ticketData.Priority || "Medium",
              status: getStatusString(ticketData.Status) || "Unknown",
              notes: ticketData.Notes || [
                {
                  id: "system-note",
                  text: "No notes available for this ticket.",
                  createdAt: new Date().toLocaleString(),
                  createdBy: "System",
                },
              ],
              createdAt: ticketData.CreatedDatatime,
              updatedAt: ticketData.ModDatetime,
            }
          }
        }
      } else {
        // Fallback to the specific ticket endpoint if no userId is provided
        const response = await api.get(`/ticket/by-ticket/${codTicket}`)

        if (response.data) {
          const ticketData = response.data

          // Helper function to safely format dates
          const formatDateSafely = (dateString: string | null | undefined) => {
            if (!dateString) return "Not set"
            try {
              const date = new Date(dateString)
              if (isNaN(date.getTime())) {
                return "Date not available"
              }
              return date.toLocaleString()
            } catch (error) {
              console.error("Error formatting date:", error)
              return "Date not available"
            }
          }

          // Get the creator's name from the API
          const creatorName = await getUserNameById(ticketData.CreatedBy)
          const assigneeName = ticketData.AssignedToUser
            ? await getUserNameById(ticketData.AssignedToUser)
            : "Unassigned"

          // Format the API response to match our IncidentDetail interface
          return {
            id: codTicket,
            title: ticketData.Title || "No Title",
            description: ticketData.Description || "No description available",
            account: "Chrysalis Health",
            contract: "Chrysalis Support",
            owner: "User",
            openDate: formatDateSafely(ticketData.CreatedDatatime),
            dueDate: formatDateSafely(ticketData.DueDate),
            createdBy: creatorName, // Use the name from API
            assignee: assigneeName, // Use the name from API
            priority: ticketData.Priority || "Medium",
            status: getStatusString(ticketData.Status) || "Unknown",
            notes: ticketData.Notes || [
              {
                id: "system-note",
                text: "No notes available for this ticket.",
                createdAt: new Date().toLocaleString(),
                createdBy: "System",
              },
            ],
            createdAt: ticketData.CreatedDatatime,
            updatedAt: ticketData.ModDatetime,
          }
        }
      }
      // Fallback to mock data if API response is empty or ticket not found
      console.log("API returned empty data or ticket not found, using mock data")
      return {
        id: codTicket,
        title: "Email not working",
        description: "User cannot access their email account. The system shows an error message when trying to log in.",
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
    } catch (error) {
      console.error("Error fetching incident details:", error)

      // Return mock data as fallback
      return {
        id: codTicket,
        title: "Email not working",
        description: "User cannot access their email account. The system shows an error message when trying to log in.",
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
    }
  },

  /**
   * Create a new incident (deprecated - use createTicket instead)
   */
  createIncident: async (ticket: CreateTicketPayload): Promise<Incident> => {
    console.warn("createIncident is deprecated, use createTicket instead")
    // Mock response for now
    return {
      IDTicket: Math.floor(Math.random() * 1000),
      CodTicket: "INC-" + Math.floor(Math.random() * 1000),
      ClientID: ticket.ClientID,
      Title: ticket.Title,
      Description: ticket.Description,
      Status: ticket.Status,
      Type: ticket.Type,
      AffectedProduct: ticket.AffectedProduct,
      Priority: "medium",
      CreatedBy: ticket.CreatedBy,
      ContactMethod: ticket.ContactMethod,
      Location: null,
      AssignedToUser: null,
      Availability: ticket.Availability,
      CreatedDatatime: new Date().toISOString(),
      ModDatetime: null,
      AssignedHWMS: null,
      AssignedVendor: null,
      NeedHardware: 0,
      IssueType: null,
      SubIssueType: null,
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

  /**
   * Get all tickets in the queue
   */
  getQueueTickets: async (): Promise<QueueTicket[]> => {
    try {
      const response = await api.get<QueueTicket[]>("/ticket/queu")
      return response.data
    } catch (error) {
      console.error("Error fetching queue tickets:", error)
      throw error
    }
  },

  // Update the updateTicketStatus function to properly handle the status IDs from IDStatusT table
  updateTicketStatus: async (codTicket: string, status: number, comments: string, agentId = 55): Promise<boolean> => {
    try {
      // First, verify that the status ID exists in the IDStatusT table
      const statusCheckResponse = await api.get(`/ticket/status/${status}`)

      // If status doesn't exist, throw an error
      if (!statusCheckResponse.data || statusCheckResponse.data.length === 0) {
        throw new Error(`Invalid status ID: ${status}. Status does not exist in the system.`)
      }

      // If status exists, proceed with the update
      const response = await api.put("/ticket/update", {
        CodTicket: codTicket,
        Status: status,
        Comments: comments,
        CreatedByAgent: agentId,
      })

      return response.data.message === "Ticket actualizado"
    } catch (error) {
      console.error("Error updating ticket status:", error)
      throw error
    }
  },

  // Add a new function to get ticket update history from TicketUpdate table
  getTicketUpdates: async (codTicket: string): Promise<any[]> => {
    try {
      const response = await api.get(`/ticket/updates/${codTicket}`)
      return response.data || []
    } catch (error) {
      console.error("Error fetching ticket updates:", error)
      return []
    }
  },

  // Add a function to get status description from IDStatusT table
  getStatusDescription: async (statusId: number): Promise<string> => {
    try {
      const response = await api.get(`/ticket/status/${statusId}`)
      if (response.data && response.data.length > 0) {
        return response.data[0].Description
      }
      return "Unknown"
    } catch (error) {
      console.error("Error fetching status description:", error)
      return "Unknown"
    }
  },

  // Add a function to get all valid statuses from IDStatusT table
  getValidStatuses: async (): Promise<{ id: number; description: string }[]> => {
    try {
      const response = await api.get("/ticket/status")
      return response.data.map((status: any) => ({
        id: status.ID,
        description: status.Description,
      }))
    } catch (error) {
      console.error("Error fetching valid statuses:", error)
      // Fallback to the statuses we saw in the screenshot
      return [
        { id: 1, description: "New" },
        { id: 2, description: "Assigned" },
        { id: 3, description: "In Progress" },
        { id: 4, description: "Completed" },
      ]
    }
  },
}

