"use client"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { orderApi, type OrderDTO } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

export default function OrderSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const orderId = searchParams?.get("orderId")
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

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/account/orders")}>View My Orders</Button>
          </div>
        </main>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="font-serif text-4xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>

          {order && (
            <div className="bg-card border rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Order Number</p>
              <p className="font-mono text-xl font-bold text-primary">{order.id}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Order Total: <span className="font-semibold text-foreground">${order.total.toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="bg-card border rounded-lg p-8 mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4">What's Next?</h2>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-sm text-muted-foreground">You'll receive an email confirmation shortly</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-muted-foreground">We'll prepare your order for shipment</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm text-muted-foreground">Your fragrances will arrive in 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/account/orders")}>
              View My Orders
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent" onClick={() => router.push("/shop")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </section>
  )
}