"use client"

import { useState, useMemo } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Search,UserPlus, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { incidentsService } from "@/services/incidents/incidents.service"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AssignTechnicianDialogProps {
  ticketId: string
  currentTechnicianId?: number | null
  onAssigned: () => void
}

export function AssignTechnicianDialog({ ticketId, currentTechnicianId, onAssigned }: AssignTechnicianDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<string>("")
  const [technicians, setTechnicians] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingTechs, setFetchingTechs] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Load technicians when dialog opens
  const handleDialogOpen = async (open: boolean) => {
    setIsOpen(open)
    if (open) {
      try {
        setFetchingTechs(true)
        setError(null)
        const techs = await incidentsService.getTechnicians()
        setTechnicians(techs)
        // Set current technician if one is assigned
        if (currentTechnicianId) {
          setSelectedTechnician(currentTechnicianId.toString())
        }
      } catch (err) {
        setError("Failed to load technicians")
      } finally {
        setFetchingTechs(false)
      } 
    }else{
      setSearchQuery("")
    }
  }

  const filteredTechnicians = useMemo(() => {
    if(!searchQuery.trim()) return technicians

    return technicians.filter((tech) => tech.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()))
  }, [technicians, searchQuery])
  
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
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Technician
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technicians..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {fetchingTechs ? (
              <div className="flex items-center space-x-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading technicians...</span>
              </div>
            ) : (
              <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-1">
                {filteredTechnicians.length > 0 ? (
                  filteredTechnicians.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTechnician(tech.id.toString())}
                      className={cn(
                        "flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm",
                        selectedTechnician === tech.id.toString()
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      <span>{tech.name}</span>
                      {selectedTechnician === tech.id.toString() && <Check className="h-4 w-4" />}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {searchQuery ? "No technicians found" : "No technicians available"}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {selectedTechnician && !fetchingTechs && (
            <div className="text-sm text-muted-foreground mt-2">
              Selected: {technicians.find((t) => t.id.toString() === selectedTechnician)?.name}
            </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={loading || fetchingTechs || !selectedTechnician}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

