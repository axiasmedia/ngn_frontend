import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface PopularItemProps {
  title: string
}

export function PopularItem({ title }: PopularItemProps) {
  return (
    <Card className="hover:bg-accent cursor-pointer transition-colors">
      <CardContent className="p-4 text-center">
        <Button variant="ghost" className="w-full h-full flex flex-col gap-2">
          <Plus className="h-6 w-6" />
          <span className="text-sm">{title}</span>
        </Button>
      </CardContent>
    </Card>
  )
}

