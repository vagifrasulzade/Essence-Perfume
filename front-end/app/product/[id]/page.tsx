"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ProductDetail from "@/components/ProductDetail"
import MainLayout from "@/layout/MainLayout"
import { productApi } from "@/lib/api"
import { convertApiProductToProduct, type Product } from "@/lib/products"

export default function ProductPage() {
  const params = useParams()
  const id = (params?.id as string) || ""
  const [product, setProduct] = useState<Product | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false)
        setError("Product ID is required")
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Try to parse as number (API uses numeric IDs)
        const productId = parseInt(id, 10)
        let loadedProduct: Product | null = null

        if (!isNaN(productId)) {
          // Try to load from API first
          try {
            const apiProduct = await productApi.getByIdPublic(productId)
            if (apiProduct) {
              loadedProduct = convertApiProductToProduct(apiProduct)
            }
          } catch (apiErr) {
            console.warn("Failed to load product from API:", apiErr)
          }
        }

        if (loadedProduct) {
          setProduct(loadedProduct)
        } else {
          setError("Product not found")
        }
      } catch (err: any) {
        console.error("Error loading product:", err)
        setError(err.message || "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || `Product with ID "${id}" was not found.`}
            </p>
            <a href="/shop" className="text-primary hover:underline">
              Back to Shop
            </a>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <ProductDetail product={product} productId={id} />
    </MainLayout>
  )
}
