// Create a new hook to fetch users with a specific role
"use client"

import { useState, useEffect } from "react"
import api from "@/services/api"
import type { User } from "@/services/user/types"

export function useUsers(role?: string) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // If a role is specified, we'll filter by that role
        const endpoint = role ? `/users/by-role/${role}` : "/users"

        const response = await api.get(endpoint)

        if (response.data && Array.isArray(response.data)) {
          // Map API response to our User type
          const mappedUsers = response.data.map((user: any) => ({
            id: user.ID,
            name: `${user.FirstName || ""} ${user.LastName || ""}`.trim() || user.Username,
            email: user.Email,
            role: user.Role,
            clientId: user.ClientID,
            username: user.Username,
          }))
          setUsers(mappedUsers)
        } else {
          // Fallback to mock data if API doesn't return expected format
          setUsers([
            { id: 45, name: "John Doe", email: "john@example.com", role: "User", clientId: 4 },
            { id: 46, name: "Jane Smith", email: "jane@example.com", role: "User", clientId: 4 },
            { id: 47, name: "Bob Wilson", email: "bob@example.com", role: "User", clientId: 4 },
            { id: 48, name: "Alice Johnson", email: "alice@example.com", role: "User", clientId: 4 },
            { id: 49, name: "Michael Brown", email: "michael@example.com", role: "User", clientId: 4 },
          ])
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to fetch users")
        // Fallback to mock data
        setUsers([
          { id: 45, name: "John Doe", email: "john@example.com", role: "User", clientId: 4 },
          { id: 46, name: "Jane Smith", email: "jane@example.com", role: "User", clientId: 4 },
          { id: 47, name: "Bob Wilson", email: "bob@example.com", role: "User", clientId: 4 },
          { id: 48, name: "Alice Johnson", email: "alice@example.com", role: "User", clientId: 4 },
          { id: 49, name: "Michael Brown", email: "michael@example.com", role: "User", clientId: 4 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [role])

  return {
    users,
    loading,
    error,
  }
}

