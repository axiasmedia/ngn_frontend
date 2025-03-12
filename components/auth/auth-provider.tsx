"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import  jwtDecode from "jwt-decode"
import { authService } from "@/services/auth/auth.service"
import type { TokenPayload } from "@/services/auth/types"

// Update the AuthContextType to include userInfo
interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  userInfo: {
    id: number
    email: string
    clientId: number
  } | null
  isLoading: boolean
  login: (email: string, password: string, isUserPortal?: boolean) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<{ id: number; email: string; clientId: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if token exists in localStorage
    const token = authService.getToken()

    if (token) {
      try {
        // Decode the token to get user information
        const decoded = jwtDecode<TokenPayload>(token)

        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          // Token is expired
          handleLogout()
          setIsLoading(false)
          return
        }

        // Token is valid
        setIsAuthenticated(true)
        setUserRole(decoded.role)

        // Set user info from token
        setUserInfo({
          id: decoded.id,
          email: decoded.email,
          clientId: decoded.client,
        })
      } catch (error) {
        // Invalid token
        handleLogout()
      }
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Handle redirects based on authentication status
    if (!isLoading) {
      const isLoginPage = pathname === "/" || pathname === "/technician"

      if (!isAuthenticated && !isLoginPage) {
        // Not authenticated and not on login page - redirect to login
        router.push("/")
      } else if (isAuthenticated && isLoginPage) {
        // Authenticated but on login page - redirect to appropriate dashboard
        redirectBasedOnRole()
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, userRole])

  const redirectBasedOnRole = () => {
    if (userRole === "User") {
      router.push("/dashboard")
    } else {
      router.push("/technician/dashboard")
    }
  }

  // Update the login function to also set userInfo
  const login = async (email: string, password: string, isUserPortal = true) => {
    try {
      setError(null)
      setIsLoading(true)

      // Use the auth service to login
      const { access_token } = await authService.login({ email, password })

      // Decode token to get user role
      const decoded = jwtDecode<TokenPayload>(access_token)
      console.log(decoded)
      // Check if user is trying to access the correct portal
      const isUser = decoded.role === "User"
      console.log({ isUser, isUserPortal, role: decoded.role })
      if (isUserPortal && !isUser) {
        // User trying to access user portal with technician credentials
        setError("You're using technician credentials on the user portal. Please use the technician portal instead.")
        return
      }

      if (!isUserPortal && isUser) {
        // Technician trying to access technician portal with user credentials
        setError("You're using user credentials on the technician portal. Please use the user portal instead.")
        return
      }

      // Store token using the auth service
      authService.setToken(access_token)

      // Update state
      setIsAuthenticated(true)
      setUserRole(decoded.role)

      // Set user info from token
      setUserInfo({
        id: decoded.id,
        email: decoded.email,
        clientId: decoded.client,
      })

      // Redirect based on role
      if (decoded.role === "User") {
        router.push("/dashboard")
      } else {
        router.push("/technician/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUserRole(null)
    setUserInfo(null)
  }

  const logout = () => {
    handleLogout()
    router.push("/")
  }

  const value = {
    isAuthenticated,
    userRole,
    userInfo,
    isLoading,
    login,
    logout: handleLogout,
    error,
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

