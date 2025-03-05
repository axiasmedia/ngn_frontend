"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

interface NavSectionProps {
  title: string
  items: NavItem[]
}

export function NavSection({ title, items }: NavSectionProps) {
  const pathname = usePathname()

  return (
    <div>
      <div className="px-3 pb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-md w-full",
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

