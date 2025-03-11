"use client"

import { useState, useEffect } from "react"
import { incidentsService } from "@/services/incidents/incidents.service"
import type { IncidentNote } from "@/services/incidents/types"

export function useTicketUpdates(codTicket: string) {
  const [notes, setNotes] = useState<IncidentNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true)
        const updates = await incidentsService.getTicketUpdates(codTicket)
        const formattedNotes = await incidentsService.convertUpdatesToNotes(updates)
        setNotes(formattedNotes)
        setError(null)
      } catch (err) {
        console.error("Error fetching ticket updates:", err)
        setError("Failed to load ticket updates")
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [codTicket])

  return {
    notes,
    loading,
    error,
    refetch: async () => {
      setLoading(true)
      try {
        const updates = await incidentsService.getTicketUpdates(codTicket)
        const formattedNotes = await incidentsService.convertUpdatesToNotes(updates)
        setNotes(formattedNotes)
        setError(null)
      } catch (err) {
        setError("Failed to load ticket updates")
      } finally {
        setLoading(false)
      }
    },
  }
}

