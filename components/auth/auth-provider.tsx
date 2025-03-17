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
    if (userRole === "Admin") {
      router.push("/admin/dashboard")
    } else if (userRole === "User") {
      router.push("/dashboard")
    } else {
      router.push("/technician/dashboard")
    }
  }

  // Update the login function to also set userInfo
  const login = async (email: string, password: string, isUserPortal = true) => {
    try {
      console.log("Login process started", {
        email,
        isUserPortal,
        timestamp: new Date().toISOString(),
        currentUrl: typeof window !== "undefined" ? window.location.href : "SSR",
        environment: process.env.NODE_ENV,
      })

      setError(null)
      setIsLoading(true)

      // Use the auth service to login
      console.log("Calling auth service login")
      const startTime = performance.now()

      try {
        const response = await authService.login({ email, password })
        const endTime = performance.now()

        console.log("Auth service login successful", {
          responseTime: `${(endTime - startTime).toFixed(2)}ms`,
          hasToken: !!response.access_token,
          tokenLength: response.access_token?.length,
        })

        // Decode token to get user role
        const access_token = response.access_token
        console.log("Decoding JWT token")

        try {
          const decoded = jwtDecode<TokenPayload>(access_token)
          console.log("Token decoded successfully", {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            client: decoded.client,
            tokenExpiration: new Date(decoded.exp * 1000).toISOString(),
            isExpired: decoded.exp < Date.now() / 1000,
          })

          // Check if user is trying to access the correct portal
          const isUser = decoded.role === "User"
          const isAdmin = decoded.role === "Admin"
          console.log("Portal access check", {
            userRole: decoded.role,
            isUser,
            isAdmin,
            isUserPortal,
            portalMismatch: (!isAdmin && isUserPortal && !isUser) || (!isAdmin && !isUserPortal && isUser),
          })

          // Admin can access both portals
          if (!isAdmin) {
            if (isUserPortal && !isUser) {
              console.warn("Portal mismatch: Technician credentials on user portal")
              setError(
                "You're using technician credentials on the user portal. Please use the technician portal instead.",
              )
              setIsLoading(false)
              return
            }

            if (!isUserPortal && isUser) {
              console.warn("Portal mismatch: User credentials on technician portal")
              setError("You're using user credentials on the technician portal. Please use the user portal instead.")
              setIsLoading(false)
              return
            }
          }

          // Store token using the auth service
          console.log("Storing token in localStorage")
          authService.setToken(access_token)

          // Update state
          console.log("Updating authentication state")
          setIsAuthenticated(true)
          setUserRole(decoded.role)

          // Set user info from token
          const userInfoData = {
            id: decoded.id,
            email: decoded.email,
            clientId: decoded.client,
          }
          console.log("Setting user info", userInfoData)
          setUserInfo(userInfoData)

          // Redirect based on role
          let redirectPath = decoded.role === "User" ? "/dashboard" : "/technician/dashboard"
          if (decoded.role === "Admin") {
            redirectPath = "/admin/dashboard"
          }
          console.log(`Redirecting to ${redirectPath}`)
          router.push(redirectPath)
        } catch (decodeError) {
          console.error("Token decode error", {
            error: decodeError,
            token: `${access_token.substring(0, 10)}...`,
            tokenLength: access_token.length,
          })
          setError("Invalid token format. Please try again.")
        }
      } catch (loginError: any) {
        console.error("Login API call failed", {
          error: loginError.message,
          status: loginError.response?.status,
          data: loginError.response?.data,
        })

        // Check for specific error types
        if (loginError.message.includes("Network Error")) {
          setError("Network error. Please check your connection and try again.")
        } else if (loginError.response?.status === 401) {
          setError("Invalid credentials. Please try again.")
        } else if (loginError.response?.status === 404) {
          setError("Authentication service not found. Please contact support.")
        } else {
          setError("Login failed. Please try again.")
        }
      }
    } catch (error: any) {
      console.error("Unexpected login error", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
      console.log("Login process completed")
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

