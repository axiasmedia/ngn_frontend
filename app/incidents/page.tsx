import { IncidentForm } from "@/components/features/incidents/incident-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function IncidentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/incidents/list">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to incidents
          </Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Report a New Incident</h1>
      <IncidentForm />
    </div>
  )
}

