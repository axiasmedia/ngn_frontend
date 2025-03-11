"use client"

import { useState, useEffect } from "react"
import { userService } from "@/services/user/user.service"
import type { User } from "@/services/user/types"
import { useAuth } from "@/components/auth/auth-provider"

export function useUser() {
  const { userInfo } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userInfo?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userData = await userService.getUserById(userInfo.id)
        setUser(userData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch user details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userInfo?.id])

  return {
    user,
    loading,
    error,
  }
}

