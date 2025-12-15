"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { orderApi, type OrderDTO } from "@/lib/api"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"

export default function UserOrderDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const orderId = params?.id as string
  const [order, setOrder] = useState<OrderDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (orderId) {
      loadOrder()
    }
  }, [orderId, user, router])

  const loadOrder = async () => {
    if (!orderId) return

    try {
      setLoading(true)
      setError(null)
      const orderData = await orderApi.getUserOrderById(orderId)
      setOrder(orderData)
    } catch (err: any) {
      console.error("Error loading order:", err)
      setError(err.message || "Failed to load order")
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

  const statusSteps = [
    { status: "pending" as const, label: "Pending", icon: Clock, description: "Order received" },
    { status: "processing" as const, label: "Processing", icon: Package, description: "Preparing order" },
    { status: "shipped" as const, label: "Shipped", icon: Truck, description: "Order shipped" },
    { status: "delivered" as const, label: "Delivered", icon: CheckCircle, description: "Order delivered" },
  ]

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error || "Order not found"}</p>
            <Button onClick={() => router.push("/account/orders")}>Back to Orders</Button>
          </div>
        </div>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex((step) => step.status === order.status)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Button variant="ghost" onClick={() => router.push("/account/orders")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Order {order.id}</h1>
            <p className="text-muted-foreground">Order placed on {new Date(order.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon
                const isActive = index <= currentStepIndex
                const isCurrent = step.status === order.status

                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div className="flex items-center w-full">
                      {index > 0 && <div className={`flex-1 h-1 ${isActive ? "bg-primary" : "bg-muted"}`} />}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`flex-1 h-1 ${isActive && index < currentStepIndex ? "bg-primary" : "bg-muted"}`}
                        />
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="flex gap-4 border-b pb-4 last:border-0">
                      <div className="relative w-20 h-20 bg-accent rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name || "Order Item"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                        <p className="text-sm text-muted-foreground">Volume: {item.volume}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">${(item.subtotal || item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.shipping.address}</p>
                <p className="text-sm">
                  {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                </p>
                <p className="text-sm">{order.shipping.country}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}










