import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function NotificationButton() {
  return (
    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 relative">
      <Bell className="h-5 w-5" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      <span className="sr-only">Notifications</span>
    </Button>
  )
}

