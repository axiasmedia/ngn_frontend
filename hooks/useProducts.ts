"use client"

import { useState, useEffect } from "react"
import { productService } from "@/services/products/products.service"
import type { Product } from "@/services/products/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error("Error in useProducts hook:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
  }
}

