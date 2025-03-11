import api from "../api"
import type { LoginCredentials, LoginResponse } from "./types"

export const authService = {
  /**
   * Authenticate user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials)
    return response.data
  },

  /**
   * Log out the current user
   */
  logout: (): void => {
    localStorage.removeItem("access_token")
  },

  /**
   * Get the current authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem("access_token")
  },

  /**
   * Set the authentication token
   */
  setToken: (token: string): void => {
    localStorage.setItem("access_token", token)
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token")
  },
}

