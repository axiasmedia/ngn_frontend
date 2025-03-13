import api from "@/services/api"
import type { Product, ProductResponse } from "./types"

export const productService = {
  /**
   * Get all available products
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ProductResponse>("/products/")

      if (response.data && Array.isArray(response.data)) {
        // Map the API response to our simplified product structure
        return response.data.map((product) => ({
          id: product.IDProduct,
          name: product.Description,
        }))
      }

      console.warn("Unexpected response format from products API, using fallback data")
      return productService.getFallbackProducts()
    } catch (error) {
      console.error("Error fetching products:", error)
      // Fallback to mock data if API fails
      return productService.getFallbackProducts()
    }
  },

  /**
   * Get a product by ID
   */
  getProductById: async (productId: number): Promise<Product | null> => {
    try {
      const products = await productService.getProducts()
      return products.find((product) => product.id === productId) || null
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error)
      return null
    }
  },

  /**
   * Get product name by ID
   */
  getProductName: async (productId: number): Promise<string> => {
    try {
      const product = await productService.getProductById(productId)
      return product ? product.name : `Product ${productId}`
    } catch (error) {
      console.error(`Error getting product name for ID ${productId}:`, error)
      return `Product ${productId}`
    }
  },

  /**
   * Fallback products for when the API fails
   */
  getFallbackProducts: (): Product[] => {
    return [
      { id: 1, name: "Laptop" },
      { id: 2, name: "Desktop" },
      { id: 3, name: "Application" },
      { id: 4, name: "Handset" },
      { id: 5, name: "Printer" },
      { id: 6, name: "Softphone" },
    ]
  },
}

