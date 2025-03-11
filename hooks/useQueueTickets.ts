"use client"

import { useState, useEffect } from "react"
import { incidentsService } from "@/services/incidents/incidents.service"
import type { QueueTicket } from "@/services/incidents/types"

export function useQueueTickets() {
  const [tickets, setTickets] = useState<QueueTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const data = await incidentsService.getQueueTickets()
        setTickets(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch tickets")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  return {
    tickets,
    loading,
    error,
    refetch: async () => {
      setLoading(true)
      try {
        const data = await incidentsService.getQueueTickets()
        setTickets(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch tickets")
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
  }
}

