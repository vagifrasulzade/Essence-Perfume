"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, Star } from "lucide-react"
import type { Product } from "@/lib/products"
import { calculateDiscountedPrice } from "@/lib/products"
import { useFavorites } from "@/context/favorites-context"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(product.id)

  const isOutOfStock = !(product.volumes?.some((v) => v.stock > 0))

  const GenderClass = product.gender ? `category-${product.gender}` : ""

  const discountPercentage = product.discountPercentage || 0
  
  const originalPrice = (() => {
    if (typeof product.price === "number") return product.price
    const prices = product.volumes?.map(v => v.price) ?? []
    if (prices.length === 0) return undefined
    return Math.min(...prices)
  })()
  
  const discountedPrice = originalPrice !== undefined && discountPercentage > 0
    ? calculateDiscountedPrice(originalPrice, discountPercentage)
    : originalPrice

  return (
    <div className={cn("group relative", GenderClass)}>
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-card rounded-lg overflow-hidden mb-4 relative border border-border/50">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
         
        </div>
      </Link>

      <button
        onClick={async (e) => {
          e.preventDefault()
          await toggleFavorite(product.id)
        }}
        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn("h-5 w-5", favorite ? "fill-primary text-primary" : "text-muted-foreground")}
        />
      </button>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
          {product.gender && (
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
              {product.gender === "kid" ? "Kids" : product.gender === "gifts" ? "Gift Set" : product.gender}
            </span>
          )}
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          {/* Show available volumes (e.g., 30ml, 50ml) */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {product.volumes?.map((v) => (
              <span key={v.size} className="capitalize">{v.size}ml</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          {typeof discountedPrice === "number" ? (
            <div className="flex items-center gap-2">
              <p className={cn("font-semibold", discountPercentage > 0 && "text-primary")}>
                ${discountedPrice.toFixed(2)}
              </p>
              {discountPercentage > 0 && originalPrice !== undefined && originalPrice !== discountedPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Price unavailable</p>
          )}
        </div>
      </div>
    </div>
  )
}
