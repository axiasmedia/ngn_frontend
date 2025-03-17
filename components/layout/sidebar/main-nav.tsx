"use client"

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
  Shield,
  UserPlus,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { NavSection } from "./nav-section"
import { useAuth } from "@/components/auth/auth-provider"

export function MainNav() {
  const { userRole } = useAuth()

  // Base navigation items
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
          href: "/incidents/list",
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

  // Admin-specific navigation items
  const adminNavItems = [
    {
      section: "Admin",
      items: [
        {
          title: "Admin Dashboard",
          href: "/admin/dashboard",
          icon: Shield,
        },
        {
          title: "Create User",
          href: "/admin/users/new",
          icon: UserPlus,
        },
        {
          title: "Manage Users",
          href: "/admin/users",
          icon: Users,
        },
      ],
    },
  ]

  // Add admin items if user is an admin
  const allNavItems = userRole === "Admin" ? [...adminNavItems, ...navItems] : navItems

  return (
    <nav className="space-y-6 py-2">
      {allNavItems.map((section, index) => (
        <div key={section.section}>
          {index > 0 && <Separator className="my-4" />}
          <NavSection title={section.section} items={section.items} />
        </div>
      ))}
    </nav>
  )
}

