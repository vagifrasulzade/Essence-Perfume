"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { productApi } from "@/lib/api"
import type { ApiProduct } from "@/lib/products"
import { convertApiProductToProduct, calculateDiscountedPrice } from "@/lib/products"
import { Plus, Edit, Trash2, Star, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminProducts() {
  const [productList, setProductList] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadProducts = async () => {
    setLoading(true)
    try {
      // Get products from API
      let apiProducts: ApiProduct[] = []
      try {
        const result = await productApi.getAll(page, 10, undefined)
        console.log("Products API response:", result)
        
        if (result && result.items && Array.isArray(result.items)) {
          apiProducts = result.items
          if (result.meta) {
            setTotalPages(result.meta.totalPages || Math.ceil((result.meta.totalCount || result.items.length) / (result.meta.pageSize || 10)))
          } else {
            setTotalPages(1)
          }
        }
      } catch (apiError) {
        console.warn("API products failed:", apiError)
      }
      
      setProductList(apiProducts)
    } catch (error: any) {
      console.error("Error loading products:", error)
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
    if (confirm("Are you sure you want to permanently delete this product? This action cannot be undone.")) {
      try {
        await productApi.delete(productId)
        alert("Product deleted successfully!")
        loadProducts() // Reload products after delete
      } catch (error: any) {
        console.error("Error deleting product:", error)
        alert(`Failed to delete product: ${error.message || "Unknown error"}`)
      }
    }
  }

  const handlDelete = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.delete(productId)
        alert("Product deleted successfully!")
        loadProducts() // Reload products after delete
      } catch (error: any) {
        console.error("Error deleting product:", error)
        alert(`Failed to delete product: ${error.message || "Unknown error"}`)
      }
    }
  }

  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your perfume catalog</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/products/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : productList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found. Add your first product!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product) => {
              // Debug: Log volumes to check discountPercentage
              if (product.volumes && product.volumes.length > 0) {
                console.log(`Product ${product.id} volumes:`, product.volumes.map(v => ({
                  size: v.size,
                  price: v.price,
                  discountPercentage: v.discountPercentage
                })))
              }
              
              return (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48 bg-accent">
                  <Image
                    src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  {product.featured && <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>}
                </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-serif text-lg font-bold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              {/* Volumes and Prices */}
              <div className="space-y-2 border-t pt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Available Volumes</p>
                <div className="grid grid-cols-2 gap-2">
                  {product.volumes?.map((volume) => {
                    // Safely extract discountPercentage - handle both camelCase and PascalCase
                    const rawDiscount = (volume as any).discountPercentage ?? (volume as any).DiscountPercentage ?? volume.discountPercentage ?? 0
                    const discountPercentage = typeof rawDiscount === 'number' ? rawDiscount : (typeof rawDiscount === 'string' ? parseFloat(rawDiscount) || 0 : 0)
                    const discountedPrice = discountPercentage > 0 && discountPercentage <= 100
                      ? calculateDiscountedPrice(volume.price, discountPercentage)
                      : volume.price
                    
                    return (
                    <div
                      key={volume.size}
                      className={`p-2 rounded-lg border-2 ${
                        volume.stock > 0
                          ? "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                          : "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{volume.size}ml</span>
                        <Badge
                          variant={volume.stock > 0 ? "default" : "secondary"}
                          className="h-5 text-xs px-1.5"
                        >
                          {volume.stock > 0 ? `${volume.stock}` : "Out"}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <div className="flex flex-col">
                          <p className="text-sm font-bold">
                            ${discountedPrice.toFixed(2)}
                            {discountPercentage > 0 && (
                              <span className="ml-2 text-xs text-red-600 font-semibold">
                                -{discountPercentage}%
                              </span>
                            )}
                          </p>
                          {discountPercentage > 0 && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${volume.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">
                  {product.volumes && product.volumes.length > 0 ? (
                    <>
                      Price range: ${(Math.min(...product.volumes.map((v) => {
                        const discountPercentage = v.discountPercentage || 0
                        return discountPercentage > 0
                          ? calculateDiscountedPrice(v.price, discountPercentage)
                          : v.price
                      }))).toFixed(2)} - $
                      {(Math.max(...product.volumes.map((v) => {
                        const discountPercentage = v.discountPercentage || 0
                        return discountPercentage > 0
                          ? calculateDiscountedPrice(v.price, discountPercentage)
                          : v.price
                      }))).toFixed(2)}
                    </>
                  ) : (
                    "No volumes available"
                  )}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/admin/products/edit/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
              )
            })}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
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
