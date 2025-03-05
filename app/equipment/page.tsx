import { DeviceList } from "@/components/features/equipment/device-list"

export default function EquipmentPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">My devices</h1>
      <DeviceList />
    </div>
  )
}

