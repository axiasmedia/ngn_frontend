import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function HelpButton() {
  return (
    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
      <HelpCircle className="h-5 w-5" />
      <span className="sr-only">Help</span>
    </Button>
  )
}

