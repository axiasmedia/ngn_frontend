"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { useAuth } from "@/components/auth/auth-provider"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  // Don't show layout for login pages
  const isLoginPage = pathname === "/" || pathname === "/technician"

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (isLoginPage || !isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
        <RightSidebar />
      </div>
    </div>
  )
}

