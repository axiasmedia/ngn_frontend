"use client"

import { useState, useEffect, useCallback } from "react"
import { incidentsService } from "@/services/incidents/incidents.service"
import type { Incident, IncidentDetail, IncidentNote } from "@/services/incidents/types"

export function useIncidents(userId?: number) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncidents = useCallback(async () => {
    if (!userId) {
      setError("User ID is required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await incidentsService.getIncidents(userId)
      setIncidents(data)
      setError(null)
    } catch (err) {
      setError("The user do not have incidents created")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  return {
    incidents,
    loading,
    error,
    refetch: fetchIncidents,
  }
}

export function useIncidentDetails(id: string) {
  const [incident, setIncident] = useState<IncidentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncident = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
    } catch (err) {
      setError("Failed to fetch incident details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchIncident()
  }, [fetchIncident])

  const addNote = async (text: string): Promise<IncidentNote | null> => {
    try {
      const newNote = await incidentsService.addNote(id, text)
      setIncident((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          notes: [...prev.notes, newNote],
        }
      })
      return newNote
    } catch (err) {
      setError("Failed to add note")
      console.error(err)
      return null
    }
  }


  return {
    incident,
    loading,
    error,
    refetch: fetchIncident,
    addNote,
    
  }
}

