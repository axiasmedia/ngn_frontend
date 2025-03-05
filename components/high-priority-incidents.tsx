import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function HighPriorityIncidents() {
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">High priority incidents</h2>
      <Card className="bg-white">
        <CardContent className="p-0">
          <div className="bg-gray-300 h-32 sm:h-40 flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=160&width=600"
              alt="High priority incidents"
              width={600}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

