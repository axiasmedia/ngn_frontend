import api from "@/services/api"
import type { Incident, IncidentDetail, IncidentNote, CreateTicketPayload, QueueTicket, TicketStatus, TicketUpdate } from "./types"

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
// Helper function to safely format dates
const formatDateSafely = (dateString: string | null | undefined): string => {
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
  updateStatus: async (incidentId: string, statusId: number, note: string): Promise<void> => {
    try {
      const payload = {
        CodTicket: incidentId,
        Status: statusId,
        Comments: note,
        CreatedByAgent: 55, // Using a default agent ID, in a real app this would come from the logged-in user
      }

      await api.put("/ticket/update", payload)
      console.log(`Updated incident ${incidentId} status to ${statusId} with note: ${note}`)
    } catch (error) {
      console.error("Error updating ticket status:", error)
      throw error
    }
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

  // Update the getTicketStatuses function to handle different API response formats

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

  /**
   * Get all available ticket statuses
   */
  getTicketStatuses: async (): Promise<TicketStatus[]> => {
    try {
      const response = await api.get<any[]>("/ticket/status")

      // Log the raw response to understand the structure
      console.log("Raw ticket status response:", response.data)

      // Check if we have data and it's an array
      if (response.data && Array.isArray(response.data)) {
        // Try to map the response to our expected format
        return response.data.map((item, index) => {
          // Handle different possible structures
          if (typeof item === "object" && item !== null) {
            // Try to find ID and Description fields with various possible names
            const id =
              item.IDStatusT !== undefined
                ? item.IDStatusT
                : item.id !== undefined
                  ? item.id
                  : item.ID !== undefined
                    ? item.ID
                    : index + 1

            const description =
              item.Description !== undefined
                ? item.Description
                : item.description !== undefined
                  ? item.description
                  : item.name !== undefined
                    ? item.name
                    : `Status ${index + 1}`

            return {
              IDStatusT: id,
              Description: description,
            }
          }

          // If item is not an object, create a default status
          return {
            IDStatusT: index + 1,
            Description: `Status ${index + 1}`,
          }
        })
      }

      // Fallback to mock data if response is not as expected
      console.warn("Unexpected response format from ticket status API, using fallback data")
      return [
        { IDStatusT: 1, Description: "Open" },
        { IDStatusT: 2, Description: "In Progress" },
        { IDStatusT: 3, Description: "Resolved" },
        { IDStatusT: 4, Description: "Closed" },
        { IDStatusT: 5, Description: "Pending" },
        { IDStatusT: 6, Description: "Cancelled" },
      ]
    } catch (error) {
      console.error("Error fetching ticket statuses:", error)
      // Fallback to mock data if API fails
      return [
        { IDStatusT: 1, Description: "Open" },
        { IDStatusT: 2, Description: "In Progress" },
        { IDStatusT: 3, Description: "Resolved" },
        { IDStatusT: 4, Description: "Closed" },
        { IDStatusT: 5, Description: "Pending" },
        { IDStatusT: 6, Description: "Cancelled" },
      ]
    }
  },

  /**
   * Get ticket details by ticket code
   */
  getTicketByCode: async (codTicket: string): Promise<any> => {
    try {
      const response = await api.get(`/ticket/by-ticket/${codTicket}`)
      return response.data
    } catch (error) {
      console.error("Error fetching ticket details:", error)
      throw error
    }
  },


  /**
   * Get ticket updates history
   */
  getTicketUpdates: async (codTicket: string): Promise<TicketUpdate[]> => {
    try {
      const response = await api.get(`/ticket/by-ticket/${codTicket}`)
      return response.data || []
    } catch (error) {
      console.error("Error fetching ticket updates:", error)
      return []
    }
  },

  /**
   * Convert ticket updates to notes format
   */
  convertUpdatesToNotes: async (updates: TicketUpdate[]): Promise<IncidentNote[]> => {
    console.log("Processing updates:", updates)
    const notes: IncidentNote[] = []

    // Get all status descriptions for mapping
    let statusMap: Record<number, string> = {}
    try {
      const statuses = await incidentsService.getTicketStatuses()
      statusMap = statuses.reduce(
        (map, status) => {
          map[status.IDStatusT] = status.Description
          return map
        },
        {} as Record<number, string>,
      )
    } catch (error) {
      console.error("Error fetching status descriptions:", error)
      // Fallback status map
      statusMap = {
        1: "Open",
        2: "In Progress",
        3: "Resolved",
        4: "Closed",
        5: "Pending",
        6: "Cancelled",
      }
    }

    for (const update of updates) {
      try {
        // Get the agent name who created the update
        let agentName = "Tech Support Team"
        if (update.CreatedByAgent) {
          try {
            agentName = await getUserNameById(update.CreatedByAgent)
          } catch (err) {
            console.warn(`Could not get name for agent ${update.CreatedByAgent}:`, err)
          }
        }
        // Format the note text based on the update type
        let noteText = update.Comments || ""

        // If it's a status change and not already formatted as such
        if (update.Status && !noteText.toLowerCase().includes("status changed")) {
          const statusDescription = statusMap[update.Status] || `Status ${update.Status}`

          // For ticket creation, use a simpler format
          if (noteText.toLowerCase().includes("ticket created")) {
            noteText = `${noteText} (Status: ${statusDescription})`
          } else {
            // For status updates, use a more descriptive format
            noteText = `Status changed to "${statusDescription}": ${noteText}`
          }
        }

        notes.push({
          id: update.IDAuton.toString(),
          text: noteText,
          createdAt: formatDateSafely(update.CreatedDatatime),
          createdBy: agentName || "System",
        })
      } catch (error) {
        console.error("Error converting update to note:", error)
      }
    }

    return notes
  },

  /**
   * Assign a technician to a ticket
   */
  assignTechnician: async (codTicket: string, technicianId: number): Promise<void> => {
    try {
      const payload = {
        CodTicket: codTicket,
        AssignedTo: technicianId,
      }

      await api.put("/ticket/assign", payload)
      console.log(`Assigned technician ${technicianId} to ticket ${codTicket}`)
    } catch (error) {
      console.error("Error assigning technician:", error)
      throw error
    }
  },

  // Add getTechnicians function to fetch available technicians
  getTechnicians: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await api.get("/ticket/tech")

      if (response.data && Array.isArray(response.data)) {
        // Map the API response to the format we need
        return response.data.map((tech) => ({
          id: tech.ID,
          name: `${tech.FirstName || ""} ${tech.LastName || ""}`.trim() || tech.Username,
        }))
      }

      console.warn("Unexpected response format from technicians API, using fallback data")
      return [
        { id: 55, name: "IT Support 2 IT" },
        { id: 56, name: "Maria Garcia" },
        { id: 57, name: "David Johnson" },
      ]
    } catch (error) {
      console.error("Error fetching technicians:", error)
      // Fallback to mock data if API fails
      return [
        { id: 55, name: "IT Support 2 IT" },
        { id: 56, name: "Maria Garcia" },
        { id: 57, name: "David Johnson" },
      ]
    }
  },
  /**
   * Get all hardware technicians
   */
  getHardwareTechnicians: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await api.get("/ticket/tech-hardware")

      if (response.data && Array.isArray(response.data)) {
        // Map the API response to the format we need
        return response.data.map((tech) => ({
          id: tech.ID,
          name: tech.FirstName || `Technician ${tech.ID}`,
        }))
      }

      console.warn("Unexpected response format from hardware technicians API, using fallback data")
      return [
        { id: 70, name: "Hardware Tech 1" },
        { id: 71, name: "Hardware Tech 2" },
        { id: 72, name: "Hardware Tech 3" },
      ]
    } catch (error) {
      console.error("Error fetching hardware technicians:", error)
      // Fallback to mock data if API fails
      return [
        { id: 70, name: "Hardware Tech 1" },
        { id: 71, name: "Hardware Tech 2" },
        { id: 72, name: "Hardware Tech 3" },
      ]
    }
  },

  /**
   * Get all vendors
   */
  getVendors: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await api.get("/ticket/vendor")

      if (response.data && Array.isArray(response.data)) {
        // Map the API response to the format we need
        return response.data.map((vendor) => ({
          id: vendor.IDVendor,
          name: vendor.Name || `Vendor ${vendor.IDVendor}`,
        }))
      }

      console.warn("Unexpected response format from vendors API, using fallback data")
      return [
        { id: 1, name: "TechSupply Inc." },
        { id: 2, name: "Hardware Solutions Ltd." },
        { id: 3, name: "IT Equipment Partners" },
      ]
    } catch (error) {
      console.error("Error fetching vendors:", error)
      // Fallback to mock data if API fails
      return [
        { id: 1, name: "TechSupply Inc." },
        { id: 2, name: "Hardware Solutions Ltd." },
        { id: 3, name: "IT Equipment Partners" },
      ]
    }
  },

  /**
   * Assign hardware technician or vendor to a ticket
   */
  assignHardware: async (codTicket: string, needHardware: number, assignedId: number): Promise<void> => {
    try {
      let payload

      if (needHardware === 1) {
        // Assign hardware technician
        payload = {
          CodTicket: codTicket,
          NeedHardware: 1,
          AssignedHardwareId: assignedId,
        }
      } else if (needHardware === 2) {
        // Assign vendor
        payload = {
          CodTicket: codTicket,
          NeedHardware: 2,
          AssignedVendor: assignedId,
        }
      } else {
        throw new Error("Invalid needHardware value. Must be 1 (technician) or 2 (vendor).")
      }

      await api.post("/ticket/assignHardware", payload)
      console.log(
        `Assigned ${needHardware === 1 ? "hardware technician" : "vendor"} ${assignedId} to ticket ${codTicket}`,
      )
    } catch (error) {
      console.error("Error assigning hardware:", error)
      throw error
    }
  },
  //Temporal Mockup
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
}
