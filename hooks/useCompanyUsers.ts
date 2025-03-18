"use client"

import { useState, useEffect } from "react"
import { userService } from "@/services/user/user.service"
import type { User } from "@/services/user/types"
import { useAuth } from "@/components/auth/auth-provider"

export function useCompanyUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userInfo } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userInfo?.clientId) {
        setLoading(false)
        setError("No client ID available")
        return
      }

      try {
        setLoading(true)
        setError(null)

        const companyUsers = await userService.getUsersByCompanyId(userInfo.clientId)
        setUsers(companyUsers)
      } catch (err) {
        console.error("Error fetching company users:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch users")

        // Fallback to mock data
        setUsers([
          {
            id: 45,
            name: "Lila Melendez",
            email: "",
            personalEmail: "lila@testprueba.com",
            role: "User",
            clientId: userInfo.clientId,
            username: "Lilam",
            status: "Active",
          },
          { id: 46, name: "Jane Smith", email: "jane@example.com", role: "User", clientId: userInfo.clientId },
          { id: 47, name: "Bob Wilson", email: "bob@example.com", role: "User", clientId: userInfo.clientId },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [userInfo?.clientId])

  return { users, loading, error }
}

