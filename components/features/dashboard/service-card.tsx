import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceCardProps {
  title: string
  imageUrl: string
  icon?: LucideIcon
  href: string
}

export function ServiceCard({ title, imageUrl, icon: Icon, href }: ServiceCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="bg-white p-4 h-full transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer">
        <div className="h-32 bg-gray-100 mb-4 rounded-lg flex items-center justify-center">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={300}
            height={128}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          <span>{title}</span>
        </div>
      </Card>
    </Link>
  )
}

