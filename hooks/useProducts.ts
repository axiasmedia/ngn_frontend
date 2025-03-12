"use client"

import { useState, useEffect } from "react"
import api from "@/services/api"

interface Product {
  IDProduct: number
  Description: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await api.get<Product[]>("/products/")

        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data)
        } else {
          console.error("Invalid product data format:", response.data)
          setError("Failed to load products: Invalid data format")
        }
      } catch (err) {
        console.error("Error fetching products:", err)
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

