import api from "@/services/api"
import type { User, UserResponse, ApiUser } from "./types"

export const userService = {
  /**
   * Get user details by ID
   */
  getUserById: async (userId: number): Promise<User> => {
    try {
      const response = await api.get<UserResponse>(`/ticket/user/${userId}`)

      // The API returns an array, we expect the first item
      if (response.data && response.data.length > 0) {
        const apiUser: ApiUser = response.data[0]

        // Map the API user to our application's user model
        return {
          id: apiUser.ID,
          name: `${apiUser.FirstName || ""} ${apiUser.LastName || ""}`.trim() || apiUser.Username,
          email: apiUser.Email || apiUser.PersonalEmail || "",
          role: apiUser.Role,
          clientId: apiUser.ClientID,
          username: apiUser.Username,
          personalEmail: apiUser.PersonalEmail,
          status: apiUser.Status,
        }
      }

      throw new Error("User not found")
    } catch (error) {
      console.error("Error fetching user details:", error)

      // Fallback to mock data if API fails
      return {
        id: userId,
        name: "User",
        email: "user@chrysalishealth.org",
        role: "User",
        clientId: 1,
      }
    }
  },

  // Add a helper function to get user name
  getUserNameById: async (userId: number): Promise<User> => {
    try {
      const response = await api.get<UserResponse>(`/ticket/user/${userId}`)

      // The API returns an array, we expect the first item
      if (response.data && response.data.length > 0) {
        const apiUser: ApiUser = response.data[0]

        // Map the API user to our application's user model
        return {
          id: apiUser.ID,
          name: `${apiUser.FirstName || ""} ${apiUser.LastName || ""}`.trim() || apiUser.Username,
          email: apiUser.Email || apiUser.PersonalEmail || "",
          role: apiUser.Role,
          clientId: apiUser.ClientID,
          username: apiUser.Username,
          personalEmail: apiUser.PersonalEmail,
          status: apiUser.Status,
        }
      }

      throw new Error("User not found")
    } catch (error) {
      console.error("Error fetching user details:", error)

      // Fallback to mock data if API fails
      return {
        id: userId,
        name: "User",
        email: "user@chrysalishealth.org",
        role: "User",
        clientId: 1,
      }
    }
  },

  // Add a helper function to get just the user's name
  getUserName: async (userId: number | string | null | undefined): Promise<string> => {
    if (!userId) return "Unknown"

    try {
      const numericId = typeof userId === "string" ? Number.parseInt(userId, 10) : userId
      if (isNaN(numericId)) return "Unknown"

      const user = await userService.getUserById(numericId)
      return user.name
    } catch (error) {
      console.error(`Error getting user name for ID ${userId}:`, error)
      return `User ${userId}`
    }
  },

  /**
   * Get all users from a specific company
   */
  getUsersByCompanyId: async (companyId: number): Promise<User[]> => {
    try {
      const response = await api.get<ApiUser[]>(`/user/company/${companyId}`)

      // Map the API response to our application's user model
      return response.data.map((apiUser) => ({
        id: apiUser.ID,
        name: `${apiUser.FirstName || ""} ${apiUser.LastName || ""}`.trim() || apiUser.Username,
        email: apiUser.Email || apiUser.PersonalEmail || "",
        role: apiUser.Role,
        clientId: apiUser.ClientID,
        username: apiUser.Username,
        personalEmail: apiUser.PersonalEmail,
        status: apiUser.Status,
      }))
    } catch (error) {
      console.error(`Error fetching users for company ${companyId}:`, error)

      // Return empty array if API fails
      return []
    }
  },
}

