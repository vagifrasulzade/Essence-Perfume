"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Button } from "./ui/button"
import { productApi } from "@/lib/api"

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [stockData, setStockData] = useState<Record<string, Record<string, number>>>({})

  // Require user to be logged in to view cart
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/cart")
    }
  }, [user, router])

  // Load stock data from API for all products in cart
  useEffect(() => {
    if (!user || items.length === 0) {
      return
    }

    const loadStockData = async () => {
      const stockMap: Record<string, Record<string, number>> = {}
      
      for (const item of items) {
        const productId = parseInt(item.id, 10)
        
        // Get stock from API (all products should be from API now)
        if (!isNaN(productId)) {
          try {
            const product = await productApi.getByIdPublic(productId)
            if (product && product.volumes) {
              const volumeMap: Record<string, number> = {}
              product.volumes.forEach((vol: { size: number; stock: number }) => {
                volumeMap[String(vol.size)] = vol.stock
              })
              stockMap[item.id] = volumeMap
            }
          } catch (error) {
            console.warn(`Failed to load stock for product ${productId} from API:`, error)
          }
        }
      }
      
      setStockData(stockMap)
    }

    loadStockData()
  }, [items, user])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </main>
      </div>
    )
  }

  // Guest users can view their cart, but need to login for checkout
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some fragrances to get started</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </main>
      </div>
    )
  }

  const getAvailableStock = (productId: string, volume: string): number => {
    // First try API stock data
    if (stockData[productId] && stockData[productId][volume] !== undefined) {
      return stockData[productId][volume]
    }
    
    // If stock data is still loading, return 0 to prevent adding more than available
    // This will be updated once API call completes
    return 0
  }

  return (
    <section className="min-h-screen flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="font-serif text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.volume}`} className="bg-card border rounded-lg p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">{item.brand}</p>
                        <h3 className="font-serif text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.volume} ml</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.volume)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.volume, item.quantity - 1)}
                          className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        {(() => {
                          const available = getAvailableStock(item.id, item.volume)
                          const disabled = available > 0 && item.quantity >= available
                          return (
                            <button
                              onClick={() => {
                                if (!disabled && available > 0) {
                                  updateQuantity(item.id, item.volume, item.quantity + 1)
                                } else if (available === 0) {
                                  alert("This item is out of stock")
                                } else if (item.quantity >= available) {
                                  alert(`Only ${available} items available in stock`)
                                }
                              }}
                              disabled={disabled || available === 0}
                              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={available === 0 ? "Out of stock" : disabled ? `Only ${available} available` : "Increase quantity"}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          )
                        })()}
                      </div>
                      <div className="text-xs text-muted-foreground ml-2">
                        {(() => {
                          const stock = getAvailableStock(item.id, item.volume)
                          return stock > 0 ? `${stock} in stock` : "Out of stock"
                        })()}
                      </div>
                      <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-lg">${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" className="w-full mt-3 bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

    </section>
  )
}
