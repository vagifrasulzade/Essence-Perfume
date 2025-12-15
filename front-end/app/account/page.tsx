"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useFavorites } from "@/context/favorites-context"
import { useCart } from "@/context/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Heart, ShoppingBag, User, Mail, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { orderApi, type OrderDTO } from "@/lib/api"

// Helper function to convert OrderDTO to Order format for display
const convertOrderDTOToOrder = (orderDto: OrderDTO) => {
  return {
    id: orderDto.id,
    userId: String(orderDto.userId),
    customerName: orderDto.customerName,
    customerEmail: orderDto.customerEmail,
    date: orderDto.date,
    status: orderDto.status,
    total: Number(orderDto.total),
    shipping: {
      address: orderDto.shipping.address,
      city: orderDto.shipping.city,
      state: orderDto.shipping.state,
      zip: orderDto.shipping.zip,
      country: orderDto.shipping.country,
    },
    items: orderDto.items.map((item) => ({
      id: String(item.id),
      name: item.name,
      brand: item.brand,
      volume: item.volume,
      price: Number(item.price),
      quantity: item.quantity,
      image: item.image || "/placeholder.svg",
    })),
  }
}

export default function Account() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const { itemCount } = useCart()
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const orders = await orderApi.getUserOrders()
      // Convert OrderDTO to Order format for compatibility
      const convertedOrders = orders.map(convertOrderDTOToOrder)
      setUserOrders(convertedOrders)
    } catch (err: any) {
      console.error("Error loading orders:", err)
      setError(err.message || "Failed to load orders")
      // On error, set empty array so UI doesn't break
      setUserOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const recentOrders = userOrders.slice(0, 3)

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and view your activity</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Total Orders",
      value: userOrders.length,
      icon: Package,
      href: "/account/orders",
      color: "text-blue-600",
    },
    {
      label: "Favorites",
      value: favorites.length,
      icon: Heart,
      href: "/favorites",
      color: "text-red-600",
    },
    {
      label: "Cart Items",
      value: itemCount,
      icon: ShoppingBag,
      href: "/cart",
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your profile and view your activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full bg-background flex items-center justify-center ${stat.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Link href="/account/settings">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{user.firstname} {user.lastname}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {user.role === "admin" ? "Admin Account" : "Customer Account"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={loadOrders} className="mt-2">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            {userOrders.length > 0 && (
              <Link href="/account/orders">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                    <Badge variant="secondary" className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                  <Link href={`/track-order?orderId=${order.id}`}>
                    <Button variant="outline" size="sm">
                      Track
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
