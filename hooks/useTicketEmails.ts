"use client"

import { useState, useEffect } from "react"
import api from "@/services/api"

export interface TicketEmail {
  subject: string
  body: string
}

export function useTicketEmails(ticketId: string) {
  const [emails, setEmails] = useState<TicketEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmails = async () => {
      if (!ticketId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await api.get<TicketEmail[]>(`/ticket/emails/${ticketId}`)
        setEmails(response.data)
        setError(null)
      } catch (err) {
        console.error(`Error fetching emails for ticket ${ticketId}:`, err)
        setError("Failed to load ticket emails")
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [ticketId])

  return {
    emails,
    loading,
    error,
  }
}

