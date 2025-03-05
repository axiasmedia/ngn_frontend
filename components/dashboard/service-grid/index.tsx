import { ServiceCard } from "../service-card"
import { AlertTriangle, HelpCircle, Package, Ticket } from "lucide-react"

export function ServiceGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <ServiceCard
        title="Order something"
        imageUrl="/placeholder.svg?height=128&width=300"
        icon={Package}
        href="/catalog"
      />
      <ServiceCard
        title="Help guides"
        imageUrl="/placeholder.svg?height=128&width=300"
        icon={HelpCircle}
        href="/docs"
      />
      <ServiceCard
        title="Report an issue"
        imageUrl="/placeholder.svg?height=128&width=300"
        icon={AlertTriangle}
        href="/incidents"
      />
      <ServiceCard
        title="View all tickets"
        imageUrl="/placeholder.svg?height=128&width=300"
        icon={Ticket}
        href="/incidents/list"
      />
    </div>
  )
}

