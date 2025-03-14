"use client"

import { useState, useEffect } from "react"
import { incidentsService } from "@/services/incidents/incidents.service"
import type { TicketStatus } from "@/services/incidents/types"

// Update the useTicketStatuses hook to work with the simplified interface
export function useTicketStatuses() {
  const [statuses, setStatuses] = useState<TicketStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Add mappings for status descriptions to icons and colors
  const [statusMappings, setStatusMappings] = useState<{
    [key: string]: { id: number; color: string; icon: string }
  }>({})

  // Update the fetchStatuses function to include all the specific status descriptions with appropriate icons
  const fetchStatuses = async () => {
    try {
      setLoading(true)
      const data = await incidentsService.getTicketStatuses()

      // Log the actual data structure to understand what we're receiving
      console.log("Ticket statuses from API:", data)

      // Process the data to ensure it has the expected structure
      const processedData = data.map((status) => {
        return {
          IDStatusT: status.IDStatusT,
          Description: status.Description || "Unknown Status",
        }
      })

      setStatuses(processedData)

      // Create mappings based on status descriptions
      const mappings: { [key: string]: { id: number; color: string; icon: string } } = {}

      // Map each status description to an appropriate icon and color
      const statusIconMap: Record<string, { icon: string; color: string }> = {
        New: { icon: "alert-circle", color: "bg-blue-100 text-blue-800" },
        Assigned: { icon: "user-check", color: "bg-indigo-100 text-indigo-800" },
        "In Progress": { icon: "clock", color: "bg-amber-100 text-amber-800" },
        Completed: { icon: "check-circle", color: "bg-green-100 text-green-800" },
        "Waiting for Customer": { icon: "user-clock", color: "bg-purple-100 text-purple-800" },
        Escalated: { icon: "arrow-up", color: "bg-red-100 text-red-800" },
        Reopened: { icon: "refresh-cw", color: "bg-orange-100 text-orange-800" },
        "On-Site Visit": { icon: "map-pin", color: "bg-cyan-100 text-cyan-800" },
        "Awaiting Shipment": { icon: "package", color: "bg-yellow-100 text-yellow-800" },
        "On Boarding": { icon: "user-plus", color: "bg-teal-100 text-teal-800" },
        "Awaiting Replacement": { icon: "replace", color: "bg-rose-100 text-rose-800" },
        Scheduled: { icon: "calendar", color: "bg-violet-100 text-violet-800" },
        "Waiting for Vendor response": { icon: "building", color: "bg-slate-100 text-slate-800" },
        "Response Received": { icon: "message-square", color: "bg-emerald-100 text-emerald-800" },
        "On-Site Progress": { icon: "tool", color: "bg-sky-100 text-sky-800" },
        "User response": { icon: "user", color: "bg-fuchsia-100 text-fuchsia-800" },
        // Default fallbacks for common statuses
        Open: { icon: "alert-circle", color: "bg-blue-100 text-blue-800" },
        Resolved: { icon: "check-circle", color: "bg-green-100 text-green-800" },
        Closed: { icon: "check-circle", color: "bg-gray-100 text-gray-800" },
        Pending: { icon: "clock", color: "bg-purple-100 text-purple-800" },
        Cancelled: { icon: "x-circle", color: "bg-red-100 text-red-800" },
        Unknown: { icon: "help-circle", color: "bg-gray-100 text-gray-800" }, // Add a fallback for unknown statuses
      }

      // Process each status from the API
      processedData.forEach((status) => {
        const description = status.Description

        // Check if we have a predefined mapping for this status
        if (statusIconMap[description]) {
          mappings[description] = {
            id: status.IDStatusT,
            color: statusIconMap[description].color,
            icon: statusIconMap[description].icon,
          }
        } else {
          // Default mapping for unknown statuses
          mappings[description] = {
            id: status.IDStatusT,
            color: "bg-gray-100 text-gray-800",
            icon: "help-circle",
          }
        }
      })

      // Add all the predefined mappings for statuses that might not be in the API response
      Object.entries(statusIconMap).forEach(([description, mapping]) => {
        if (!mappings[description]) {
          mappings[description] = {
            id: 0, // Default ID since we don't know the actual ID
            color: mapping.color,
            icon: mapping.icon,
          }
        }
      })

      console.log("Created status mappings:", mappings)
      setStatusMappings(mappings)
      setError(null)
    } catch (err) {
      console.error("Error fetching ticket statuses:", err)
      setError("Failed to fetch ticket statuses")

      // Set fallback statuses with all the predefined ones
      setStatuses([
        { IDStatusT: 1, Description: "New" },
        { IDStatusT: 2, Description: "Assigned" },
        { IDStatusT: 3, Description: "In Progress" },
        { IDStatusT: 4, Description: "Completed" },
        { IDStatusT: 5, Description: "Waiting for Customer" },
        { IDStatusT: 6, Description: "Escalated" },
        { IDStatusT: 7, Description: "Reopened" },
        { IDStatusT: 8, Description: "On-Site Visit" },
        { IDStatusT: 9, Description: "Awaiting Shipment" },
        { IDStatusT: 10, Description: "On Boarding" },
        { IDStatusT: 11, Description: "Awaiting Replacement" },
        { IDStatusT: 12, Description: "Scheduled" },
        { IDStatusT: 13, Description: "Waiting for Vendor response" },
        { IDStatusT: 14, Description: "Response Received" },
        { IDStatusT: 15, Description: "On-Site Progress" },
        { IDStatusT: 16, Description: "User response" },
      ])

      // Set fallback mappings with all the predefined ones
      const fallbackMappings: { [key: string]: { id: number; color: string; icon: string } } = {}
      const statusIconMap: Record<string, { icon: string; color: string }> = {
        New: { icon: "alert-circle", color: "bg-blue-100 text-blue-800" },
        Assigned: { icon: "user-check", color: "bg-indigo-100 text-indigo-800" },
        "In Progress": { icon: "clock", color: "bg-amber-100 text-amber-800" },
        Completed: { icon: "check-circle", color: "bg-green-100 text-green-800" },
        "Waiting for Customer": { icon: "user-clock", color: "bg-purple-100 text-purple-800" },
        Escalated: { icon: "arrow-up", color: "bg-red-100 text-red-800" },
        Reopened: { icon: "refresh-cw", color: "bg-orange-100 text-orange-800" },
        "On-Site Visit": { icon: "map-pin", color: "bg-cyan-100 text-cyan-800" },
        "Awaiting Shipment": { icon: "package", color: "bg-yellow-100 text-yellow-800" },
        "On Boarding": { icon: "user-plus", color: "bg-teal-100 text-teal-800" },
        "Awaiting Replacement": { icon: "replace", color: "bg-rose-100 text-rose-800" },
        Scheduled: { icon: "calendar", color: "bg-violet-100 text-violet-800" },
        "Waiting for Vendor response": { icon: "building", color: "bg-slate-100 text-slate-800" },
        "Response Received": { icon: "message-square", color: "bg-emerald-100 text-emerald-800" },
        "On-Site Progress": { icon: "tool", color: "bg-sky-100 text-sky-800" },
        "User response": { icon: "user", color: "bg-fuchsia-100 text-fuchsia-800" },
        // Default fallbacks for common statuses
        Open: { icon: "alert-circle", color: "bg-blue-100 text-blue-800" },
        Resolved: { icon: "check-circle", color: "bg-green-100 text-green-800" },
        Closed: { icon: "check-circle", color: "bg-gray-100 text-gray-800" },
        Pending: { icon: "clock", color: "bg-purple-100 text-purple-800" },
        Cancelled: { icon: "x-circle", color: "bg-red-100 text-red-800" },
        Unknown: { icon: "help-circle", color: "bg-gray-100 text-gray-800" },
      }

      Object.entries(statusIconMap).forEach(([description, mapping], index) => {
        fallbackMappings[description] = {
          id: index + 1,
          color: mapping.color,
          icon: mapping.icon,
        }
      })

      setStatusMappings(fallbackMappings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatuses()
  }, [])

  // Update the getStatusDescription function to use IDStatusT field
  const getStatusDescription = (statusId: number): string => {
    // First try to find the status in our fetched statuses
    const status = statuses.find((s) => s.IDStatusT === statusId)
    if (status?.Description) {
      return status.Description
    }

    // If not found in fetched statuses, use fallback mapping
    switch (statusId) {
      case 1:
        return "New"
      case 2:
        return "In Progress"
      case 3:
        return "Resolved"
      case 4:
        return "Closed"
      case 5:
        return "Pending"
      case 6:
        return "Cancelled"
      default:
        return "New" // Default to "New" if status is unknown
    }
  }

  // Add new functions to get color and icon based on status description
  const getStatusColorByDescription = (description: string): string => {
    const normalizedDesc = description.trim()
    if (statusMappings[normalizedDesc]) {
      return statusMappings[normalizedDesc].color
    }

    // Try to find a partial match
    for (const [key, value] of Object.entries(statusMappings)) {
      if (normalizedDesc.toLowerCase().includes(key.toLowerCase())) {
        return value.color
      }
    }

    // If no match found, return a default color based on keywords
    if (normalizedDesc.toLowerCase().includes("progress") || normalizedDesc.toLowerCase().includes("pending")) {
      return "bg-amber-100 text-amber-800"
    } else if (normalizedDesc.toLowerCase().includes("resolv") || normalizedDesc.toLowerCase().includes("complete")) {
      return "bg-green-100 text-green-800"
    } else if (normalizedDesc.toLowerCase().includes("cancel")) {
      return "bg-red-100 text-red-800"
    } else if (normalizedDesc.toLowerCase().includes("close")) {
      return "bg-gray-100 text-gray-800"
    } else if (normalizedDesc.toLowerCase().includes("new") || normalizedDesc.toLowerCase().includes("open")) {
      return "bg-blue-100 text-blue-800"
    }

    return "bg-gray-100 text-gray-800" // Default fallback
  }

  const getStatusIconByDescription = (description: string): string => {
    const normalizedDesc = description.trim()
    if (statusMappings[normalizedDesc]) {
      return statusMappings[normalizedDesc].icon
    }

    // Try to find a partial match
    for (const [key, value] of Object.entries(statusMappings)) {
      if (normalizedDesc.toLowerCase().includes(key.toLowerCase())) {
        return value.icon
      }
    }

    return "info" // Default fallback
  }

  // Add functions to get color and icon based on status ID
  const getStatusColorById = (statusId: number): string => {
    const description = getStatusDescription(statusId)
    return getStatusColorByDescription(description)
  }

  const getStatusIconById = (statusId: number): string => {
    const description = getStatusDescription(statusId)
    return getStatusIconByDescription(description)
  }

  return {
    statuses,
    loading,
    error,
    getStatusDescription,
    getStatusColorByDescription,
    getStatusIconByDescription,
    getStatusColorById,
    getStatusIconById,
    statusMappings,
  }
}

