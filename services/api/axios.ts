import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if needed
      localStorage.removeItem("access_token")
      // You might want to redirect to login page here or handle it in your auth context
    }
    return Promise.reject(error)
  },
)

export default api

