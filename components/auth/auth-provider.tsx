"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  isLoading: boolean
  login: (role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    const role = localStorage.getItem("userRole")

    setIsAuthenticated(authStatus)
    setUserRole(role)
    setIsLoading(false)

    // Handle redirects based on authentication status
    const isLoginPage = pathname === "/" || pathname === "/technician"

    if (!authStatus && !isLoginPage) {
      // Not authenticated and not on login page - redirect to login
      router.push("/")
    } else if (authStatus && isLoginPage) {
      // Authenticated but on login page - redirect to appropriate dashboard
      if (role === "technician") {
        router.push("/technician/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [pathname, router])

  const login = (role: string) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userRole", role)
    setIsAuthenticated(true)
    setUserRole(role)

    if (role === "technician") {
      router.push("/technician/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    setIsAuthenticated(false)
    setUserRole(null)
    router.push("/")
  }

  const value = {
    isAuthenticated,
    userRole,
    isLoading,
    login,
    logout,
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

