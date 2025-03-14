import api from "@/services/api"
import type { Client, ClientResponse } from "./types"

export const clientService = {
  /**
   * Get all clients
   */
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await api.get<ClientResponse>("/client/")

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((client) => ({
          id: client.IDClient,
          name: client.ClientName,
        }))
      }

      console.warn("Unexpected response format from clients API")
      return []
    } catch (error) {
      console.error("Error fetching clients:", error)
      return []
    }
  },

  /**
   * Get a client by ID
   */
  getClientById: async (clientId: number): Promise<Client | null> => {
    try {
      const clients = await clientService.getClients()
      return clients.find((client) => client.id === clientId) || null
    } catch (error) {
      console.error(`Error fetching client with ID ${clientId}:`, error)
      return null
    }
  },
}

