"use client"

import { HelpButton } from "./help-button"
import { Logo } from "./logo"
import { NotificationButton } from "./notification-button"
import { UserMenu } from "./user-menu"
import { MobileNav } from "../sidebar/mobile-nav"
import { useAuth } from "@/components/auth/auth-provider"

export function Header() {
  const { userRole } = useAuth()

  return (
    <header className="border-b bg-white px-6 h-16 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <MobileNav />
        <Logo />
        {userRole === "technician" && (
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">Technician Mode</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <HelpButton />
        <NotificationButton />
        <UserMenu />
      </div>
    </header>
  )
}

