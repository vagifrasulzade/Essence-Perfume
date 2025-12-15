"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { orderApi, productApi, type OrderDTO } from "@/lib/api"
import { DollarSign, Package, ShoppingBag, TrendingUp, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"

export default function AdminPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
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
          const productsResult = await productApi.getAllPublic(1, 100)
          if (productsResult && productsResult.items) {
            setTotalProducts(productsResult.items.length)
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

  const stats = [
    {
      title: "Total Products",
      value: loading ? "..." : totalProducts,
      icon: Package,
      color: "text-blue-600",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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


        
    </section>
  )
}
