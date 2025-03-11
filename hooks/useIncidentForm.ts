"use client"

import { useState } from "react"
import { incidentsService } from "@/services/incidents/incidents.service"
import type { CreateTicketPayload } from "@/services/incidents/types"

export function useIncidentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = async (formData: CreateTicketPayload, files?: File[]) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Ensure numeric fields are numbers, not strings
      const numericPayload = {
        ...formData,
        CreatedBy: Number(formData.CreatedBy),
        Status: Number(formData.Status),
        ClientID: Number(formData.ClientID),
        AffectedProduct: Number(formData.AffectedProduct),
        AffectedUsers: formData.AffectedUsers.map((id) => Number(id)),
      }

      console.log("Submitting ticket with numeric values:", numericPayload)
      console.log("Files to be sent:", files)

      // Ensure files is always an array
      const filesToSend = files || []
      await incidentsService.createTicket(numericPayload, filesToSend)
      return true
    } catch (err) {
      console.error("Error submitting ticket:", err)
      setError(err instanceof Error ? err.message : "Failed to create ticket")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const fileArray = Array.from(newFiles)
      setFiles(fileArray)
      console.log(
        "Files selected:",
        fileArray.map((f) => f.name),
      )
    }
  }

  return {
    isSubmitting,
    error,
    files,
    handleSubmit,
    handleFileChange,
  }
}

