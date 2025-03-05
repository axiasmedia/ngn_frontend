import { Card } from "@/components/ui/card"
import Image from "next/image"

export function IncidentsSummary() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">High priority incidents</h2>
      <Card className="bg-white p-4">
        <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=160&width=600"
            alt="High priority incidents"
            width={600}
            height={160}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </Card>
    </div>
  )
}

