"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { cartApi } from "@/lib/api"
import { useAuth } from "./auth-context"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  volume: string
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>
  removeItem: (id: string, volume: string) => Promise<void>
  updateQuantity: (id: string, volume: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()
  const router = useRouter()


  // Load cart from API only if user is logged in
  useEffect(() => {
    const loadCart = async () => {
      if (typeof window === "undefined") return

      // Only load cart if user is logged in
      if (!user) {
        setItems([])
        return
      }

      // Load from localStorage first for instant UI
      const savedCartKey = `cart_${user.id}`
      const saved = localStorage.getItem(savedCartKey)
      
      let localStorageItems: CartItem[] = []
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          let loadedItems: CartItem[] = []
          
          // Handle both old format (array) and new format (object with items)
          if (Array.isArray(parsed)) {
            loadedItems = parsed
          } else if (parsed.items && Array.isArray(parsed.items)) {
            loadedItems = parsed.items
          }

          // Validate and ensure all items have required fields
          const validatedItems = loadedItems
            .filter(item => item && item.id && item.name && item.price !== undefined)
            .map(item => ({
              id: String(item.id),
              name: String(item.name || "Unknown Product"),
              brand: String(item.brand || "Unknown Brand"),
              price: Number(item.price || 0),
              volume: String(item.volume || "0"),
              image: String(item.image || "/placeholder.svg"),
              quantity: Number(item.quantity || 1)
            }))

          if (validatedItems.length > 0) {
            localStorageItems = validatedItems
            setItems(validatedItems)
            console.log("Cart loaded from localStorage:", { cartKey: savedCartKey, itemCount: validatedItems.length })
          }
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e)
        }
      }

      // Then sync with API
      try {
        const cart = await cartApi.getCart()
        // Convert API response to CartItem format
        const convertedItems: CartItem[] = cart.items.map((item) => ({
          id: String(item.productId),
          name: item.product.name,
          brand: item.product.brand,
          price: item.price,
          volume: String(item.volume),
          image: item.product.images[0]?.url || "",
          quantity: item.quantity,
        }))
        
        // If API cart has items, use API cart; otherwise keep localStorage cart
        if (convertedItems.length > 0) {
          setItems(convertedItems)
        } else if (localStorageItems.length === 0) {
          setItems([])
        }
      } catch (error) {
        console.warn("Error loading cart from API, using localStorage:", error)
        // Keep localStorage cart if API fails
        if (localStorageItems.length > 0) {
          setItems(localStorageItems)
        }
      }
    }

    loadCart()
  }, [user])

  // Save cart to localStorage whenever items change (only for logged in users)
  useEffect(() => {
    if (typeof window === "undefined" || !user) return

    // Use a debounce to avoid excessive writes
    const timeoutId = setTimeout(() => {
      try {
        const cartKey = `cart_${user.id}`
        
        if (items.length > 0) {
          // Ensure all product data is complete before saving
          const completeItems = items.map(item => ({
            id: item.id,
            name: item.name || "Unknown Product",
            brand: item.brand || "Unknown Brand",
            price: item.price || 0,
            volume: item.volume || "0",
            image: item.image || "/placeholder.svg",
            quantity: item.quantity || 1
          }))

          // Save cart with complete product data and timestamp
          const cartData = {
            items: completeItems,
            savedAt: new Date().toISOString(),
            userId: user.id,
            version: "1.0" // Version for future migrations
          }
          
          localStorage.setItem(cartKey, JSON.stringify(cartData))
          console.log("Cart saved to localStorage:", { cartKey, itemCount: completeItems.length, timestamp: cartData.savedAt })
        } else {
          // Keep empty cart structure for future items
          const cartData = {
            items: [],
            savedAt: new Date().toISOString(),
            userId: user.id,
            version: "1.0"
          }
          localStorage.setItem(cartKey, JSON.stringify(cartData))
        }
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
      }
    }, 300) // Debounce: save 300ms after last change

    return () => clearTimeout(timeoutId)
  }, [items, user])

  const addItem = async (item: Omit<CartItem, "quantity">) => {
    // Require user to be logged in to add items to cart
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    // Ensure all product data is complete
    const completeItem: CartItem = {
      id: String(item.id),
      name: String(item.name || "Unknown Product"),
      brand: String(item.brand || "Unknown Brand"),
      price: Number(item.price || 0),
      volume: String(item.volume || "0"),
      image: String(item.image || "/placeholder.svg"),
      quantity: 1
    }

    const productId = parseInt(item.id, 10)
    if (isNaN(productId)) {
      console.error("Invalid product ID:", item.id)
      return
    }

    // Try API first
    const cart = await cartApi.addItem({
      productId,
      volume: Number(item.volume),
      quantity: 1,
    })
    
    if (cart) {
      // API succeeded - convert API response to CartItem format
      const convertedItems: CartItem[] = cart.items.map((cartItem) => ({
        id: String(cartItem.productId),
        name: cartItem.product.name,
        brand: cartItem.product.brand,
        price: cartItem.price,
        volume: String(cartItem.volume),
        image: cartItem.product.images[0]?.url || "",
        quantity: cartItem.quantity,
      }))
      setItems(convertedItems)
    } else {
      // API failed - use localStorage fallback
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id && i.volume === item.volume)
        if (existing) {
          return prev.map((i) => (i.id === item.id && i.volume === item.volume ? { ...i, quantity: i.quantity + 1 } : i))
        }
        return [...prev, { ...item, quantity: 1 }]
      })
    }
  }

  const removeItem = async (id: string, volume: string) => {
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    const productId = parseInt(id, 10)
    if (isNaN(productId)) {
      console.error("Invalid product ID:", id)
      return
    }

    // Try API first
    try {
      const cart = await cartApi.removeItem(productId, Number(volume))
      if (cart) {
        // API succeeded - convert API response to CartItem format
        const convertedItems: CartItem[] = cart.items.map((cartItem) => ({
          id: String(cartItem.productId),
          name: cartItem.product.name,
          brand: cartItem.product.brand,
          price: cartItem.price,
          volume: String(cartItem.volume),
          image: cartItem.product.images[0]?.url || "",
          quantity: cartItem.quantity,
        }))
        setItems(convertedItems)
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
      // Fallback to local removal
      setItems((prev) => prev.filter((i) => !(i.id === id && i.volume === volume)))
    }
  }

  const updateQuantity = async (id: string, volume: string, quantity: number) => {
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    if (quantity <= 0) {
      await removeItem(id, volume)
      return
    }

    const productId = parseInt(id, 10)
    if (isNaN(productId)) {
      console.error("Invalid product ID:", id)
      return
    }

    // Try API first
    try {
      const cart = await cartApi.updateQuantity(productId, Number(volume), quantity)
      if (cart) {
        // API succeeded - convert API response to CartItem format
        const convertedItems: CartItem[] = cart.items.map((cartItem) => ({
          id: String(cartItem.productId),
          name: cartItem.product.name,
          brand: cartItem.product.brand,
          price: cartItem.price,
          volume: String(cartItem.volume),
          image: cartItem.product.images[0]?.url || "",
          quantity: cartItem.quantity,
        }))
        setItems(convertedItems)
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error)
      // Fallback to local update
      setItems((prev) => prev.map((i) => (i.id === id && i.volume === volume ? { ...i, quantity } : i)))
    }
  }

  const clearCart = async () => {
    if (!user) {
      setItems([])
      return
    }

    try {
      await cartApi.clearCart()
    } catch (error) {
      console.warn("Failed to clear cart via API:", error)
    }
    
    // Clear local state
    setItems([])
    
    // Also clear from localStorage
    if (typeof window !== "undefined") {
      const cartKey = `cart_${user.id}`
      localStorage.removeItem(cartKey)
      console.log("Cart cleared from localStorage:", cartKey)
    }
  }

  // Ensure items is always an array before calculating totals
  const safeItems = Array.isArray(items) ? items : []
  const total = safeItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  const itemCount = safeItems.reduce((sum, item) => sum + (item.quantity || 0), 0)

  // Ensure items is always an array for the context
  const contextItems = Array.isArray(items) ? items : []

  return (
    <CartContext.Provider value={{ items: contextItems, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
