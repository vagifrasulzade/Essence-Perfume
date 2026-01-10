import type { Product } from "@/lib/products"
import type { Order } from "@/lib/orders"
import { mockOrders as defaultOrders } from "@/lib/orders"

const PRODUCTS_KEY = "perfume_shop_products"
const ORDERS_KEY = "perfume_shop_orders"

// Products Management
// Note: Products are now loaded from API, this function is kept for backward compatibility
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []

  const storedRaw = localStorage.getItem(PRODUCTS_KEY)

  // Return stored products or empty array
  if (!storedRaw) {
    return []
  }

  const stored: Product[] = JSON.parse(storedRaw)
  return stored
}

export const saveProduct = (product: Product): void => {
  const products = getProducts()
  const existingIndex = products.findIndex((p) => p.id === product.id)

  if (existingIndex >= 0) {
    products[existingIndex] = product
  } else {
    products.push(product)
  }

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  
  // Dispatch event for cross-tab sync and component updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent('products-updated'))
  }
}

export const deleteProduct = (productId: string): void => {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== productId)
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered))
  
  // Dispatch event for cross-tab sync and component updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent('products-updated'))
  }
}


// Orders Management
export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return defaultOrders

  const stored = localStorage.getItem(ORDERS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  // Initialize with default orders
  localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders))
  return defaultOrders
}

// Note: Order management is now handled via API
// These functions are kept only for backward compatibility with TrackOrder fallback
