"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { orderApi, productApi, type OrderDTO } from "@/lib/api"
import { DollarSign, Package, ShoppingBag, TrendingUp, Loader2, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import type { ApiProduct } from "@/lib/products"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { calculateDiscountedPrice } from "@/lib/products"

export default function AdminPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [saleProducts, setSaleProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Load orders from API
        try {
          const ordersResult = await orderApi.getAll({ page: 1, pageSize: 100 })
          if (ordersResult && ordersResult.items) {
            setOrders(ordersResult.items)
          }
        } catch (orderError) {
          console.error("Failed to load orders from API:", orderError)
        }

        // Load products from API
        try {
          const productsResult = await productApi.getAll(1, 100, undefined)
          if (productsResult && productsResult.items) {
            const products = productsResult.items
            setTotalProducts(products.length)
            
            // Filter products with discount (volume-level or product-level)
            const saleItems = products.filter(product => {
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
            
            setSaleProducts(saleItems.slice(0, 6)) // Show max 6 sale products
          }
        } catch (productError) {
          console.error("Failed to load products from API:", productError)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0)
  const pendingOrders = orders.filter((o) => {
    const status = String(o.status).toLowerCase()
    return status === "pending" || status === "processing"
  }).length

  const totalSaleProducts = saleProducts.length

  const stats = [
    {
      title: "Total Products",
      value: loading ? "..." : totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Sale Products",
      value: loading ? "..." : totalSaleProducts,
      icon: Tag,
      color: "text-red-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentOrders = orders.slice(0, 5)
  return (
    <section className="space-y-8">
        <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat) => {
          const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const status = typeof order.status === 'string' ? order.status.toLowerCase() : String(order.status).toLowerCase()
                    return (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${Number(order.total).toFixed(2)}</p>
                          <p
                            className={`text-sm ${
                              status === "delivered"
                                ? "text-green-600"
                                : status === "shipped"
                                  ? "text-blue-600"
                                  : status === "processing"
                                    ? "text-orange-600"
                                    : "text-gray-600"
                            }`}
                          >
                            {typeof order.status === 'string' 
                              ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                              : String(order.status)
                            }
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
        </Card>

        {saleProducts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sale Products</CardTitle>
              <Link href="/admin/products">
                <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">View All</span>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {saleProducts.map((product) => {
                  const mainImage = product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"
                  
                  // Calculate discount percentage
                  let maxDiscountPercentage = 0
                  let originalMinPrice = 0
                  let discountedMinPrice = 0
                  const productLevelDiscount = typeof product.discountPercentage === 'number' ? product.discountPercentage : (typeof product.discountPercentage === 'string' ? parseFloat(product.discountPercentage) || 0 : 0)
                  
                  if (product.volumes && product.volumes.length > 0) {
                    product.volumes.forEach(v => {
                      const rawDiscount = (v as any).discountPercentage ?? (v as any).DiscountPercentage ?? v.discountPercentage ?? 0
                      const volumeDiscount = typeof rawDiscount === 'number' ? rawDiscount : (typeof rawDiscount === 'string' ? parseFloat(rawDiscount) || 0 : 0)
                      const originalPrice = Number(v.price) || 0
                      
                      if (volumeDiscount > maxDiscountPercentage) {
                        maxDiscountPercentage = volumeDiscount
                      }
                      
                      if (originalPrice > 0) {
                        if (originalMinPrice === 0 || originalPrice < originalMinPrice) {
                          originalMinPrice = originalPrice
                          discountedMinPrice = volumeDiscount > 0 && volumeDiscount <= 100
                            ? calculateDiscountedPrice(originalPrice, volumeDiscount)
                            : originalPrice
                        }
                      }
                    })
                  }
                  
                  // Use volume-level discount if available, otherwise use product-level discount
                  if (maxDiscountPercentage === 0) {
                    maxDiscountPercentage = productLevelDiscount
                  }
                  
                  // If product-level discount exists and no volume discount, apply to min price
                  if (productLevelDiscount > 0 && maxDiscountPercentage === productLevelDiscount && discountedMinPrice === 0 && originalMinPrice > 0) {
                    discountedMinPrice = calculateDiscountedPrice(originalMinPrice, productLevelDiscount)
                  } else if (productLevelDiscount > 0 && maxDiscountPercentage === productLevelDiscount && discountedMinPrice === originalMinPrice && originalMinPrice > 0) {
                    discountedMinPrice = calculateDiscountedPrice(originalMinPrice, productLevelDiscount)
                  }
                  
                  return (
                    <Link key={product.id} href={`/admin/products/edit/${product.id}`}>
                      <div className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="relative aspect-square bg-accent rounded-lg overflow-hidden mb-2">
                          <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {maxDiscountPercentage > 0 && (
                            <Badge className="absolute top-2 left-2 bg-red-500">-{maxDiscountPercentage}%</Badge>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          {originalMinPrice > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              {discountedMinPrice > 0 && discountedMinPrice < originalMinPrice ? (
                                <>
                                  <span className="text-sm font-bold text-primary">${discountedMinPrice.toFixed(2)}</span>
                                  <span className="text-xs line-through text-muted-foreground">${originalMinPrice.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="text-sm font-bold">${originalMinPrice.toFixed(2)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
    </section>
  )
}
