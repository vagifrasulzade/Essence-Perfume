"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/page-components/components/ProductCard"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Product, convertApiProductToProduct } from "@/lib/products"
import { useFavorites } from "@/context/favorites-context"
import { productApi } from "@/lib/api"
import type { ApiProduct } from "@/lib/products"

export default function Favorites() {
  const { favorites } = useFavorites()
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load favorite products from both API and products.ts
  useEffect(() => {
    const loadFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavoriteProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Get all favorite IDs as numbers (all products should be from API now)
        const numericIds: number[] = []
        
        favorites.forEach((id) => {
          const numId = parseInt(id, 10)
          if (!isNaN(numId)) {
            numericIds.push(numId)
          }
        })

        // Fetch products from API
        let apiProducts: Product[] = []
        
        if (numericIds.length > 0) {
          const productPromises = numericIds.map(async (id) => {
            try {
              const apiProduct = await productApi.getByIdPublic(id)
              return apiProduct ? convertApiProductToProduct(apiProduct) : null
            } catch (err) {
              console.warn(`Failed to load product ${id} from API:`, err)
              return null
            }
          })
          
          const apiResults = await Promise.all(productPromises)
          apiProducts = apiResults.filter((product): product is Product => product !== null)
        }

        const mergedProducts = apiProducts

        setFavoriteProducts(mergedProducts)
        
        // If we have favorite IDs but no products loaded, show a warning
        if (favorites.length > 0 && mergedProducts.length === 0) {
          console.warn("Some favorite products could not be loaded")
        }
      } catch (err: any) {
        console.error("Error loading favorite products:", err)
        // Only set error if we have favorites but failed to load any
        if (favorites.length > 0) {
          setError(err.message || "Failed to load favorite products")
        }
        setFavoriteProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteProducts()
  }, [favorites])

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 fill-accent text-accent" />
              My Favorites
            </h1>
            <p className="text-muted-foreground">Loading your favorites...</p>
          </div>
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading favorite products...</p>
          </div>
        </main>
      </section>
    )
  }

  if (error && favoriteProducts.length === 0) {
    return (
      <section className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 fill-accent text-accent" />
              My Favorites
            </h1>
          </div>
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </main>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 fill-accent text-accent" />
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {favoriteProducts.length > 0
              ? `You have ${favoriteProducts.length} favorite ${favoriteProducts.length === 1 ? "fragrance" : "fragrances"}`
              : "Save your favorite fragrances here"}
          </p>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favoriteProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring our collection and save your favorite fragrances by clicking the heart icon
            </p>
            <Link href="/shop">
              <Button size="lg">Discover Fragrances</Button>
            </Link>
          </div>
        )}
      </main>
    </section>
  )
}
