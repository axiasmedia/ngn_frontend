import { DeviceCard } from "./device-card"

interface Device {
  name: string
  category: string
  assetTag: string
  serialNumber: string
  assignedDate: string
}

const devices: Device[] = [
  {
    name: "Laptop X1",
    category: "Hardware",
    assetTag: "BGN001",
    serialNumber: "12121212",
    assignedDate: "21/08/2023",
  },
  {
    name: "Monitor HD",
    category: "Hardware",
    assetTag: "BGN002",
    serialNumber: "12121212",
    assignedDate: "21/08/2023",
  },
  {
    name: "Keyboard K1",
    category: "Hardware",
    assetTag: "BGN003",
    serialNumber: "12121212",
    assignedDate: "21/08/2023",
  },
  {
    name: "Mouse M1",
    category: "Hardware",
    assetTag: "BGN004",
    serialNumber: "12121212",
    assignedDate: "21/08/2023",
  },
  {
    name: "Headset H1",
    category: "Hardware",
    assetTag: "BGN005",
    serialNumber: "12121212",
    assignedDate: "21/08/2023",
  },
  {
    name: "Docking D1",
    category: "Hardware",
    assetTag: "BGN006",
    serialNumber: "12121212",
    assignedDate: "21/08/2023",
  },
]

export function DeviceList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <DeviceCard
          key={device.assetTag}
          name={device.name}
          category={device.category}
          assetTag={device.assetTag}
          serialNumber={device.serialNumber}
          assignedDate={device.assignedDate}
        />
      ))}
    </div>
  )
}

