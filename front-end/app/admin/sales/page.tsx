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
      // Get featured (sale) products from API with featured filter
      const itemsPerPage = 12
      const result = await productApi.getAll(page, itemsPerPage, undefined, true)
      
      if (result && result.items && Array.isArray(result.items)) {
        setProductList(result.items)
        if (result.meta) {
          setTotalPages(result.meta.totalPages || 1)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Sale Products</h1>
          <p className="text-muted-foreground">Manage featured sale products</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/products/add">
            <Button>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading sale products...</p>
        </div>
      ) : productList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sale products found. Mark products as featured to show them here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product) => {
              const convertedProduct = convertApiProductToProduct(product)
              const mainImage = product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"
              const discountPercentage = product.discountPercentage || 0
              
              const originalMinPrice = product.volumes && product.volumes.length > 0
                ? Math.min(...product.volumes.map(v => Number(v.price)))
                : 0
              const originalMaxPrice = product.volumes && product.volumes.length > 0
                ? Math.max(...product.volumes.map(v => Number(v.price)))
                : 0
              
              const discountedMinPrice = calculateDiscountedPrice(originalMinPrice, discountPercentage)
              const discountedMaxPrice = calculateDiscountedPrice(originalMaxPrice, discountPercentage)

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
                          {discountPercentage > 0 ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">
                                  ${discountedMinPrice.toFixed(2)}
                                </span>
                                {originalMinPrice !== discountedMinPrice && (
                                  <span className="text-sm line-through text-muted-foreground">
                                    ${originalMinPrice.toFixed(2)}
                                  </span>
                                )}
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
                              <span className="text-lg font-bold">${originalMinPrice.toFixed(2)}</span>
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

