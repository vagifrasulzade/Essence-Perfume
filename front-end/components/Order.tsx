"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { orderApi, type OrderDTO } from "@/lib/api"
import { Package, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MyOrders() {
  const { user } = useAuth()
  const router = useRouter()
  const [userOrders, setUserOrders] = useState<OrderDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const orders = await orderApi.getUserOrders()
      setUserOrders(orders)
    } catch (err: any) {
      console.error("Error loading orders:", err)
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-orange-100 text-orange-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your perfume orders</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" size="sm" onClick={loadOrders} className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {userOrders.length === 0 && !loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-serif text-2xl font-bold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => router.push("/shop")}>Browse Perfumes</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Ordered on{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center gap-4 pb-3 border-b last:border-0">
                          <div className="relative w-16 h-16 bg-accent rounded-md overflow-hidden shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.brand} • {item.volume}
                            </p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.subtotal || item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline">
                            <Package className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {order.shipping && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-1">Shipping Address</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shipping.address}, {order.shipping.city}
                          {order.shipping.state && `, ${order.shipping.state}`} {order.shipping.zip}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.shipping.country}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}