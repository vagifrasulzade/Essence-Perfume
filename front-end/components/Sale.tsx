"use client"

import { type Product, convertApiProductToProduct, calculateDiscountedPrice } from "@/lib/products"
import { productApi } from "@/lib/api"
import type { ApiProduct } from "@/lib/products"
import { useState, useEffect } from "react"
import { ProductCard } from "@/page-components/components/ProductCard"

export default function Sale() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Load products from both API and products.ts
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        // Get all products from API - fetch all pages
        let apiProducts: Product[] = []
        try {
          let page = 1
          let hasMorePages = true
          const pageSize = 100
          
          while (hasMorePages) {
            const apiResult = await productApi.getAllPublic(page, pageSize)
            
            if (apiResult && apiResult.items) {
              const pageProducts = apiResult.items.map(convertApiProductToProduct)
              apiProducts = [...apiProducts, ...pageProducts]
              
              // Check if there are more pages
              if (apiResult.meta && apiResult.meta.totalPages) {
                hasMorePages = page < apiResult.meta.totalPages
                page++
              } else {
                hasMorePages = false
              }
            } else {
              hasMorePages = false
            }
          }
          
        } catch (apiError) {
          console.error("API products failed:", apiError)
        }
        
        // Filter for sale items (products with volume-level discount > 0)
        const saleProducts = apiProducts.filter(product => {
          // Check volume-level discounts
          if (product.volumes && product.volumes.length > 0) {
            return product.volumes.some(volume => {
              const rawDiscount = (volume as any).discountPercentage ?? (volume as any).DiscountPercentage ?? volume.discountPercentage ?? 0
              const volumeDiscount = typeof rawDiscount === 'number' ? rawDiscount : (typeof rawDiscount === 'string' ? parseFloat(rawDiscount) || 0 : 0)
              return volumeDiscount > 0 && volumeDiscount <= 100
            })
          }
          // Fallback to product-level discount
          return (product.discountPercentage ?? 0) > 0
        })
        
        setProducts(saleProducts)
      } catch (error: any) {
        console.error("Error loading products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <section className="bg-linear-to-b from-muted/30 to-background py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Sale & Special Offers</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover amazing deals on luxury fragrances
              </p>
            </div>
          </section>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading sale products...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-linear-to-b from-muted/30 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Sale & Special Offers</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing deals on luxury fragrances - Limited time offers on premium scents
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {products.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">{products.length} products on sale</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No sale items available at the moment</p>
              <p className="text-sm text-muted-foreground">Check back soon for amazing deals!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

