"use client"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  Inbox,
  LifeBuoy,
  MonitorDot,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

const navItems = [
  {
    section: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: Home,
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    section: "Support",
    items: [
      {
        title: "Open Incidents",
        href: "/incidents/list", // Updated href
        icon: Inbox,
      },
      {
        title: "Report Issue",
        href: "/report",
        icon: LifeBuoy,
      },
    ],
  },
  {
    section: "Resources",
    items: [
      {
        title: "My Equipment",
        href: "/equipment",
        icon: MonitorDot,
      },
      {
        title: "Product Catalog",
        href: "/catalog",
        icon: ShoppingCart,
      },
      {
        title: "Software Library",
        href: "/software",
        icon: Package,
      },
    ],
  },
  {
    section: "Knowledge",
    items: [
      {
        title: "Documentation",
        href: "/docs",
        icon: FileText,
      },
      {
        title: "Training",
        href: "/training",
        icon: BookOpen,
      },
    ],
  },
  {
    section: "Administration",
    items: [
      {
        title: "User Management",
        href: "/users",
        icon: Users,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-6 py-2">
      {navItems.map((section, index) => (
        <div key={section.section}>
          {index > 0 && <Separator className="my-4" />}
          <div className="px-3 pb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.section}</h3>
          </div>
          <div className="space-y-1">
            {section.items.map((item) => (
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
      ))}
    </nav>
  )
}

