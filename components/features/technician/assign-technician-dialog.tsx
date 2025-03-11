"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { incidentsService } from "@/services/incidents/incidents.service"

interface AssignTechnicianDialogProps {
  ticketId: string
  currentTechnicianId?: number
  onAssigned: () => void
}

export function AssignTechnicianDialog({ ticketId, currentTechnicianId, onAssigned }: AssignTechnicianDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<string>("")
  const [technicians, setTechnicians] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load technicians when dialog opens
  const handleDialogOpen = async (open: boolean) => {
    setIsOpen(open)
    if (open) {
      try {
        const techs = await incidentsService.getTechnicians()
        setTechnicians(techs)
        // Set current technician if one is assigned
        if (currentTechnicianId) {
          setSelectedTechnician(currentTechnicianId.toString())
        }
      } catch (err) {
        setError("Failed to load technicians")
      }
    }
  }

  const handleAssign = async () => {
    if (!selectedTechnician) {
      setError("Please select a technician")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await incidentsService.assignTechnician(ticketId, Number(selectedTechnician))
      onAssigned()
      setIsOpen(false)
    } catch (err) {
      setError("Failed to assign technician")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Technician
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>Select a technician to assign to ticket #{ticketId}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Select Technician</Label>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id.toString()}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

