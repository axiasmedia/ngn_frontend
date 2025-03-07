import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Make sure this URL is correct
})

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    // Don't set Content-Type for FormData requests
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log the request for debugging
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`, config.data)

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
    console.error("API Error:", error.response?.data || error.message)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token")
    }
    return Promise.reject(error)
  },
)

export default api

