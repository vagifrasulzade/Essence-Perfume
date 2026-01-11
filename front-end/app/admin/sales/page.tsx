"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { productApi } from "@/lib/api"
import type { ApiProduct } from "@/lib/products"
import { convertApiProductToProduct, calculateDiscountedPrice } from "@/lib/products"
import { Edit, Trash2, Star, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminSales() {
  const [productList, setProductList] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadProducts = async () => {
    setLoading(true)
    try {
      // Get all products from API
      const itemsPerPage = 100
      const result = await productApi.getAll(page, itemsPerPage, undefined)
      
      if (result && result.items && Array.isArray(result.items)) {
        // Filter products with discount (volume-level or product-level)
        const saleProducts = result.items.filter(product => {
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
        
        setProductList(saleProducts)
        // Calculate total pages based on filtered products
        if (result.meta) {
          const filteredTotalPages = Math.ceil(saleProducts.length / 12) || 1
          setTotalPages(filteredTotalPages)
        } else {
          setTotalPages(1)
        }
      } else {
        setProductList([])
        setTotalPages(1)
      }
    } catch (error: any) {
      console.error("Error loading sale products:", error)
      setProductList([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [page])

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to permanently delete this product? This action cannot be undone.")) {
      return
    }

    try {
      await productApi.delete(productId)
      alert("Product deleted successfully!")
      loadProducts() // Reload products after delete
    } catch (error: any) {
      console.error("Error deleting product:", error)
      alert(`Failed to delete product: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">Sale Products</h1>
        <p className="text-muted-foreground">Manage products with discounts</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading sale products...</p>
        </div>
      ) : productList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sale products found. Products with discounts will appear here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product) => {
              const convertedProduct = convertApiProductToProduct(product)
              const mainImage = product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"
              
              // Calculate prices with volume-level discounts
              let originalMinPrice = 0
              let originalMaxPrice = 0
              let discountedMinPrice = 0
              let discountedMaxPrice = 0
              let maxDiscountPercentage = 0
              
              if (product.volumes && product.volumes.length > 0) {
                // Calculate discounted prices for each volume
                const pricesWithDiscounts = product.volumes.map(v => {
                  // Safely extract discountPercentage - handle both camelCase and PascalCase
                  const rawDiscount = (v as any).discountPercentage ?? (v as any).DiscountPercentage ?? v.discountPercentage ?? 0
                  const volumeDiscount = typeof rawDiscount === 'number' ? rawDiscount : (typeof rawDiscount === 'string' ? parseFloat(rawDiscount) || 0 : 0)
                  const originalPrice = Number(v.price) || 0
                  const discountedPrice = volumeDiscount > 0 && volumeDiscount <= 100 && originalPrice > 0
                    ? calculateDiscountedPrice(originalPrice, volumeDiscount)
                    : originalPrice
                  
                  // Track maximum discount percentage
                  if (volumeDiscount > maxDiscountPercentage) {
                    maxDiscountPercentage = volumeDiscount
                  }
                  
                  return { originalPrice, discountedPrice }
                }).filter(p => p.originalPrice > 0) // Filter out invalid prices
                
                if (pricesWithDiscounts.length > 0) {
                  originalMinPrice = Math.min(...pricesWithDiscounts.map(p => p.originalPrice))
                  originalMaxPrice = Math.max(...pricesWithDiscounts.map(p => p.originalPrice))
                  discountedMinPrice = Math.min(...pricesWithDiscounts.map(p => p.discountedPrice))
                  discountedMaxPrice = Math.max(...pricesWithDiscounts.map(p => p.discountedPrice))
                }
              }
              
              // Use volume-level discount if available, otherwise use product-level discount
              const productLevelDiscount = typeof product.discountPercentage === 'number' ? product.discountPercentage : (typeof product.discountPercentage === 'string' ? parseFloat(product.discountPercentage) || 0 : 0)
              const discountPercentage = maxDiscountPercentage > 0 ? maxDiscountPercentage : productLevelDiscount
              
              // If product-level discount exists and no volume discount, apply to min price
              if (productLevelDiscount > 0 && maxDiscountPercentage === productLevelDiscount && discountedMinPrice === 0 && originalMinPrice > 0) {
                discountedMinPrice = calculateDiscountedPrice(originalMinPrice, productLevelDiscount)
              } else if (productLevelDiscount > 0 && maxDiscountPercentage === productLevelDiscount && discountedMinPrice === originalMinPrice && originalMinPrice > 0) {
                discountedMinPrice = calculateDiscountedPrice(originalMinPrice, productLevelDiscount)
              }

              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square bg-accent">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {discountPercentage > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500">-{discountPercentage}%</Badge>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-2 right-2 bg-primary">Sale</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {discountPercentage > 0 && discountedMinPrice > 0 && discountedMinPrice < originalMinPrice ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">
                                  ${discountedMinPrice.toFixed(2)}
                                </span>
                                <span className="text-sm line-through text-muted-foreground">
                                  ${originalMinPrice.toFixed(2)}
                                </span>
                              </div>
                              {product.volumes && product.volumes.length > 1 && (
                                <span className="text-sm text-muted-foreground">
                                  - ${discountedMaxPrice.toFixed(2)}
                                  {originalMaxPrice !== discountedMaxPrice && (
                                    <span className="line-through ml-1">${originalMaxPrice.toFixed(2)}</span>
                                  )}
                                </span>
                              )}
                            </div>
                          ) : (
                            <>
                              <span className="text-lg font-bold">${originalMinPrice > 0 ? originalMinPrice.toFixed(2) : '0.00'}</span>
                              {product.volumes && product.volumes.length > 1 && (
                                <span className="text-sm text-muted-foreground ml-1">
                                  - ${originalMaxPrice.toFixed(2)}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <Tag className="w-4 h-4 text-primary" />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Link href={`/admin/products/edit/${product.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

