"use client"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  Inbox,
  LifeBuoy,
  LogOut,
  MonitorDot,
  Package,
  Settings,
  ShoppingCart,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSection,
  SidebarSectionTitle,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <>
              <div className="bg-primary h-8 w-8 flex items-center justify-center rounded text-primary-foreground font-bold">
                CH
              </div>
              <span className="font-semibold text-lg">Chrysalis</span>
            </>
          )}
          {isCollapsed && (
            <div className="bg-primary h-8 w-8 flex items-center justify-center rounded text-primary-foreground font-bold mx-auto">
              CH
            </div>
          )}
        </div>
        {!isCollapsed && <SidebarTrigger />}
      </SidebarHeader>

      <SidebarContent className="px-2 overflow-y-auto">
        {navItems.map((section, index) => (
          <div key={section.section} className="mb-6">
            <SidebarSection>
              <SidebarSectionTitle>{section.section}</SidebarSectionTitle>
            </SidebarSection>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <a className={cn("flex items-center gap-3", isCollapsed && "justify-center px-0")}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors",
                isCollapsed ? "justify-center" : "justify-between",
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="John Doe" />
                  <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">Administrator</span>
                  </div>
                )}
              </div>
              {!isCollapsed && <Settings className="h-4 w-4 text-muted-foreground" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isCollapsed ? "center" : "end"} side="top">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">john.doe@chrysalishealth.org</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

