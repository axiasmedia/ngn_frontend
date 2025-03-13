// Define the product types for better type safety

/**
 * Product data structure as returned from the API
 */
export interface ApiProduct {
    IDProduct: number
    Description: string
  }
  
  /**
   * Simplified product structure for internal use
   */
  export interface Product {
    id: number
    name: string
  }
  
  /**
   * Response type for product API calls
   */
  export type ProductResponse = ApiProduct[]
  
  