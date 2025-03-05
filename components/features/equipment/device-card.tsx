import { Card, CardContent } from "@/components/ui/card"

interface DeviceProps {
  name: string
  category: string
  assetTag: string
  serialNumber: string
  assignedDate: string
}

export function DeviceCard({ name, category, assetTag, serialNumber, assignedDate }: DeviceProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Asset Tag: {assetTag}</p>
            </div>
          </div>
          <div className="text-sm">
            <p>Serial #: {serialNumber}</p>
            <p>Assigned: {assignedDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

