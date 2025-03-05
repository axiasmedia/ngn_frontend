import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import Image from "next/image"

interface ArticleCardProps {
  title: string
}

export function ArticleCard({ title }: ArticleCardProps) {
  return (
    <Card className="bg-white h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="bg-gray-300 h-32 flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=128&width=250"
            alt={title}
            width={250}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex items-center gap-2">
          <FileText className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm sm:text-base">{title}</span>
        </div>
      </CardContent>
    </Card>
  )
}

