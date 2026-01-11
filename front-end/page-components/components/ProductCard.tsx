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

  // Calculate minimum price with volume-level discounts
  const { originalPrice, discountedPrice, discountPercentage: finalDiscountPercentage } = (() => {
    if (!product.volumes || product.volumes.length === 0) {
      const price = typeof product.price === "number" ? product.price : undefined
      const productDiscount = product.discountPercentage || 0
      return {
        originalPrice: price,
        discountedPrice: price !== undefined && productDiscount > 0
          ? calculateDiscountedPrice(price, productDiscount)
          : price,
        discountPercentage: productDiscount
      }
    }

    // Find volume with minimum discounted price (same logic as admin products page)
    // Also check if any volume has discount to show discount badge
    let minOriginalPrice = Infinity
    let minDiscountedPrice = Infinity
    let minDiscountPercentage = 0
    let maxDiscountPercentage = 0

    product.volumes.forEach(volume => {
      const volumeDiscount = volume.discountPercentage || 0
      const volumeOriginalPrice = volume.price
      const volumeDiscountedPrice = volumeDiscount > 0
        ? calculateDiscountedPrice(volumeOriginalPrice, volumeDiscount)
        : volumeOriginalPrice

      // Track maximum discount percentage for badge display
      if (volumeDiscount > maxDiscountPercentage) {
        maxDiscountPercentage = volumeDiscount
      }

      // Use discounted price for comparison to find the cheapest price
      if (volumeDiscountedPrice < minDiscountedPrice) {
        minDiscountedPrice = volumeDiscountedPrice
        minOriginalPrice = volumeOriginalPrice
        minDiscountPercentage = volumeDiscount
      }
    })

    // If any volume has discount, show the maximum discount percentage
    const displayDiscountPercentage = maxDiscountPercentage > 0 ? maxDiscountPercentage : minDiscountPercentage

    return {
      originalPrice: minOriginalPrice !== Infinity ? minOriginalPrice : undefined,
      discountedPrice: minDiscountedPrice !== Infinity ? minDiscountedPrice : undefined,
      discountPercentage: displayDiscountPercentage
    }
  })()

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
          {finalDiscountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{finalDiscountPercentage}%
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
              <p className={cn("font-semibold", finalDiscountPercentage > 0 && "text-primary")}>
                ${discountedPrice.toFixed(2)}
              </p>
              {finalDiscountPercentage > 0 && originalPrice !== undefined && originalPrice !== discountedPrice && (
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
