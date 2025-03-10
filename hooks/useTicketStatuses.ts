"use client"

import { useState, useEffect } from "react"
import { incidentsService } from "@/services/incidents/incidents.service"
import type { TicketStatus } from "@/services/incidents/types"

export function useTicketStatuses() {
  const [statuses, setStatuses] = useState<TicketStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true)
        const data = await incidentsService.getTicketStatuses()

        // Log the actual data structure to understand what we're receiving
        console.log("Ticket statuses from API:", data)

        // Process the data to ensure it has the expected structure
        const processedData = data.map((status) => {
          // Check if IDStatus exists, if not try to find an alternative property
          // or use the index as a fallback
          const id =
            status.IDStatus !== undefined
              ? status.IDStatus
              : 0

          // Check if Description exists, if not try to find an alternative property
          // or use a default value
          const description =
            status.Description !== undefined
              ? status.Description
              : "Unknown Status"

          return {
            IDStatus: id,
            Description: description,
          }
        })

        setStatuses(processedData)
        setError(null)
      } catch (err) {
        console.error("Error fetching ticket statuses:", err)
        setError("Failed to fetch ticket statuses")
        // Set fallback statuses
        setStatuses([
          { IDStatus: 1, Description: "Open" },
          { IDStatus: 2, Description: "In Progress" },
          { IDStatus: 3, Description: "Resolved" },
          { IDStatus: 4, Description: "Closed" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStatuses()
  }, [])

  // Helper function to get status description by ID
  const getStatusDescription = (statusId?: number): string => {
    if (!statusId) return "Unknown"
    const status = statuses.find((s) => s.IDStatus === statusId)
    return status?.Description || "Unknown"
  }

  return {
    statuses,
    loading,
    error,
    getStatusDescription,
  }
}

