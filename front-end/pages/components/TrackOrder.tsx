"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Truck, CheckCircle, MapPin, Loader2 } from "lucide-react"
import { getOrders } from "@/lib/data-store"
import type { Order } from "@/lib/orders"
import { orderApi, type OrderDTO } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

const generateTimeline = (order: OrderDTO | Order) => {
  const statuses = [
    { key: "pending", label: "Order Placed", icon: CheckCircle },
    { key: "processing", label: "Order Processed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "in-transit", label: "In Transit", icon: MapPin },
    { key: "out-for-delivery", label: "Out for Delivery", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ]

  const currentStatusIndex = statuses.findIndex((s) => s.key === order.status)
  const orderDate = new Date(order.date)

  return statuses.map((status, index) => {
    const completed = index <= currentStatusIndex
    const current = index === currentStatusIndex

    // Calculate estimated dates based on order date
    const daysToAdd = index * 2 // Each status is ~2 days apart
    const statusDate = new Date(orderDate)
    statusDate.setDate(statusDate.getDate() + daysToAdd)

    return {
      status: status.label,
      date: statusDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      time: completed ? "Completed" : "Expected",
      completed,
      current,
      icon: status.icon,
    }
  })
}

// Helper function to convert OrderDTO to Order format for display
const convertOrderDTOToOrder = (orderDto: OrderDTO): Order => {
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

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const orderIdFromUrl = searchParams?.get("orderId")
  const { user } = useAuth()

  const [orderNumber, setOrderNumber] = useState(orderIdFromUrl || "")
  const [email, setEmail] = useState("")
  const [tracking, setTracking] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (orderIdFromUrl) {
      loadOrderById(orderIdFromUrl)
    }
  }, [orderIdFromUrl, user])

  const loadOrderById = async (orderId: string) => {
    setLoading(true)
    setError("")

    try {
      // Try API first if user is logged in
      if (user) {
        try {
          const orderDto = await orderApi.getUserOrderById(orderId)
          const order = convertOrderDTOToOrder(orderDto)
          displayOrderTracking(order)
          setLoading(false)
          return
        } catch (apiError: any) {
          // If API fails (404, etc.), fall back to localStorage
          console.warn("Failed to load order from API, trying localStorage:", apiError)
        }
      }

      // Fallback to localStorage
      const orders = getOrders()
      const order = orders.find((o) => o.id === orderId)

      if (order) {
        displayOrderTracking(order)
      } else {
        setError("Order not found. Please check your order number and try again.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  const displayOrderTracking = (order: Order) => {
    const timeline = generateTimeline(order)
    const currentStatus = timeline.find((t) => t.current)

    setTracking({
      orderNumber: order.id,
      status: currentStatus?.status || "Processing",
      estimatedDelivery: timeline[timeline.length - 1].date,
      currentLocation: order.shipping?.city ? `${order.shipping.city}, ${order.shipping.state}` : "Processing Center",
      timeline,
      order,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setTracking(null)
    setLoading(true)

    if (!orderNumber) {
      setError("Please enter an order number")
      setLoading(false)
      return
    }

    try {
      // Try API first if user is logged in
      if (user) {
        try {
          const orderDto = await orderApi.getUserOrderById(orderNumber)
          
          // Verify email if provided
          if (email && orderDto.customerEmail && orderDto.customerEmail.toLowerCase() !== email.toLowerCase()) {
            setError("Email address does not match our records")
            setLoading(false)
            return
          }

          const order = convertOrderDTOToOrder(orderDto)
          displayOrderTracking(order)
          setLoading(false)
          return
        } catch (apiError: any) {
          // If API fails, fall back to localStorage
          console.warn("Failed to load order from API, trying localStorage:", apiError)
          if (apiError.status === 404 || apiError.status === 401) {
            // Don't fall through to localStorage for auth errors - show proper message
            if (apiError.status === 401) {
              setError("Please log in to track your orders")
            } else {
              setError("Order not found. Please check your order number and try again.")
            }
            setLoading(false)
            return
          }
        }
      }

      // Fallback to localStorage for guest users or if API fails
      const orders = getOrders()
      const order = orders.find((o) => o.id === orderNumber)

      if (!order) {
        setError("Order not found. Please check your order number and try again.")
        setLoading(false)
        return
      }

      if (email && order.customerEmail && order.customerEmail.toLowerCase() !== email.toLowerCase()) {
        setError("Email address does not match our records")
        setLoading(false)
        return
      }

      displayOrderTracking(order)
    } catch (err: any) {
      setError(err.message || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-muted-foreground">Enter your order number to track your shipment</p>
        </div>

        {/* Tracking Form */}
        {!tracking && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                    Order Number *
                  </label>
                  <Input
                    id="orderNumber"
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., ORD-123456"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address (Optional)
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                {!user && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                    💡 <strong>Tip:</strong> For the best experience, please{" "}
                    <a href="/login" className="underline font-medium">
                      log in
                    </a>{" "}
                    to track your orders from your account.
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Track Order"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {tracking && (
          <div className="space-y-6">
            {/* Order Status Card */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold mb-1">Order #{tracking.orderNumber}</h2>
                    <p className="text-muted-foreground">Current Status: {tracking.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="font-semibold">{tracking.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-sm text-muted-foreground">{tracking.currentLocation}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {tracking.order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${tracking.order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-8">
                <h3 className="font-serif text-xl font-bold mb-6">Tracking Timeline</h3>
                <div className="space-y-6">
                  {tracking.timeline.map((item: any, index: number) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`rounded-full p-2 ${
                              item.completed ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                            } ${item.current ? "ring-4 ring-accent/20" : ""}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {index < tracking.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ${item.completed ? "bg-accent" : "bg-muted"}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className={`font-semibold mb-1 ${item.current ? "text-accent" : ""}`}>{item.status}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.date} • {item.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setTracking(null)
                  setOrderNumber("")
                  setEmail("")
                  setError("")
                }}
              >
                Track Another Order
              </Button>
            </div>

            {/* Help Section */}
            <Card>
              <CardContent className="p-6 bg-secondary">
                <p className="text-sm text-muted-foreground">
                  Need help with your order?{" "}
                  <a href="/contact" className="text-accent hover:underline font-medium">
                    Contact our support team
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
