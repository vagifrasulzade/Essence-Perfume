"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { orderApi, type OrderDTO, type OrderUpdateDTO, type OrderShippingUpdateDTO } from "@/lib/api"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, Trash2, Loader2, Save, MapPin } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function OrderDetail() {
  const params = useParams()
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const orderId = params?.id as string
  const [order, setOrder] = useState<OrderDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [showShippingEdit, setShowShippingEdit] = useState(false)

  const [shippingData, setShippingData] = useState<OrderShippingUpdateDTO>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!isAdmin) {
      router.push("/")
      return
    }
    if (orderId) {
      loadOrder()
    }
  }, [orderId, user, isAdmin, router])

  const loadOrder = async () => {
    if (!orderId) return

    try {
      setLoading(true)
      setError(null)
      const orderData = await orderApi.getById(orderId)
      setOrder(orderData)
      // Set shipping data for editing
      if (orderData.shipping) {
        const names = orderData.customerName.split(" ")
        setShippingData({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          email: orderData.customerEmail,
          phone: "",
          address: orderData.shipping.address,
          city: orderData.shipping.city,
          zipCode: orderData.shipping.zip,
          country: orderData.shipping.country,
        })
      }
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

  const handleStatusUpdate = async (newStatus: OrderUpdateDTO["status"]) => {
    if (!order) return

    try {
      setStatusLoading(true)
      await orderApi.updateStatus(orderId, { status: newStatus })
      setOrder({ ...order, status: newStatus })
      alert(`Order status updated to ${newStatus}!`)
    } catch (err: any) {
      console.error("Error updating status:", err)
      alert(err.message || "Failed to update order status")
    } finally {
      setStatusLoading(false)
    }
  }

  const handleShippingUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return

    try {
      setShippingLoading(true)
      await orderApi.updateShipping(orderId, shippingData)
      await loadOrder() // Reload order to get updated data
      setShowShippingEdit(false)
      alert("Shipping information updated successfully!")
    } catch (err: any) {
      console.error("Error updating shipping:", err)
      alert(err.message || "Failed to update shipping information")
    } finally {
      setShippingLoading(false)
    }
  }

  const handleDeleteOrder = async () => {
    if (!order) return

    try {
      await orderApi.delete(orderId)
      alert("Order deleted successfully!")
      router.push("/admin/orders")
    } catch (err: any) {
      console.error("Error deleting order:", err)
      alert(err.message || "Failed to delete order")
    }
  }

  const statusSteps = [
    { status: "pending" as const, label: "Order Placed", icon: CheckCircle, description: "Order received" },
    { status: "processing" as const, label: "Order Processed", icon: Package, description: "Preparing order" },
    { status: "shipped" as const, label: "Shipped", icon: Truck, description: "Order shipped" },
    { status: "in-transit" as const, label: "In Transit", icon: MapPin, description: "In transit" },
    { status: "out-for-delivery" as const, label: "Out for Delivery", icon: Truck, description: "Out for delivery" },
    { status: "delivered" as const, label: "Delivered", icon: CheckCircle, description: "Order delivered" },
  ]
  
  // Map backend status to timeline step index
  const getStatusStepIndex = (status: string): number => {
    switch (status) {
      case "pending":
        return 0
      case "processing":
        return 1
      case "shipped":
        return 2
      case "in-transit":
        return 3
      case "out-for-delivery":
        return 4
      case "delivered":
        return 5
      default:
        return 0
    }
  }
  
  // For shipped status, show it as completed and show next steps as expected
  const getTimelineStatus = (stepIndex: number, orderStatus: string): { completed: boolean; current: boolean } => {
    const orderStepIndex = getStatusStepIndex(orderStatus)
    
    // If order is shipped, show shipped as completed and in-transit as current (even though backend doesn't have it)
    if (orderStatus === "shipped") {
      if (stepIndex < 2) return { completed: true, current: false } // pending, processing completed
      if (stepIndex === 2) return { completed: true, current: true } // shipped is current
      return { completed: false, current: false } // future steps
    }
    
    // If order is delivered, all steps are completed
    if (orderStatus === "delivered") {
      return { completed: stepIndex <= 5, current: stepIndex === 5 }
    }
    
    // Default behavior
    return {
      completed: stepIndex < orderStepIndex,
      current: stepIndex === orderStepIndex,
    }
  }

  // Calculate dates for each status (2 days apart)
  const calculateStatusDate = (stepIndex: number, orderDate: Date): Date => {
    const date = new Date(orderDate)
    date.setDate(date.getDate() + stepIndex * 2) // Each step is 2 days apart
    return date
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!user || !isAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error || "Order not found"}</p>
        <Button onClick={() => router.push("/admin/orders")} className="mt-4">
          Back to Orders
        </Button>
      </div>
    )
  }

  const orderDate = new Date(order.date)
  const orderStepIndex = getStatusStepIndex(order.status)

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/admin/orders")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Order {order.id}</h1>
          <p className="text-muted-foreground">Order placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete order {order.id}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Timeline - Vertical Layout */}
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const Icon = step.icon
                const timelineStatus = getTimelineStatus(index, order.status)
                const isCompleted = timelineStatus.completed
                const isCurrent = timelineStatus.current
                const statusDate = calculateStatusDate(index, orderDate)
                const statusText = isCompleted ? "Completed" : isCurrent ? "Current" : "Expected"

                return (
                  <div key={step.status} className="flex items-start gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                              ? "bg-primary/80 text-primary-foreground ring-4 ring-primary/20"
                              : "bg-muted border-2 border-muted-foreground/20 text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 my-2 ${isCompleted ? "bg-primary" : "bg-muted/30"}`}
                          style={{ minHeight: "60px" }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className={`font-semibold ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.label}
                        </p>
                        <p
                          className={`text-sm ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {formatDate(statusDate)} • {statusText}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <p className="text-sm font-medium w-full mb-2">Update Order Status:</p>
              {order.status !== "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate("pending")}
                  disabled={statusLoading}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Set to Pending
                </Button>
              )}
              {order.status !== "processing" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate("processing")}
                  disabled={statusLoading}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Start Processing
                </Button>
              )}
              {order.status !== "shipped" && order.status !== "delivered" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate("shipped")}
                  disabled={statusLoading}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Shipped
                </Button>
              )}
              {order.status !== "delivered" && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleStatusUpdate("delivered")}
                  disabled={statusLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
              {order.status !== "cancelled" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate("cancelled")}
                  disabled={statusLoading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
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
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">${item.subtotal.toFixed(2)}</p>
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
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shipping Address</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShippingEdit(!showShippingEdit)}
                >
                  {showShippingEdit ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showShippingEdit ? (
                <form onSubmit={handleShippingUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingData.country}
                      onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={shippingLoading} className="w-full">
                    {shippingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <>
                  <p>{order.shipping.address}</p>
                  <p>
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                  </p>
                  <p>{order.shipping.country}</p>
                </>
              )}
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
  )
}
