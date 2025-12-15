import type { Product } from "@/lib/products"
import type { Order } from "@/lib/orders"
import { products as defaultProducts } from "@/lib/products"
import { mockOrders as defaultOrders } from "@/lib/orders"

const PRODUCTS_KEY = "perfume_shop_products"
const ORDERS_KEY = "perfume_shop_orders"

// Products Management
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return defaultProducts

  const storedRaw = localStorage.getItem(PRODUCTS_KEY)

  // First-time init: seed and return defaults
  if (!storedRaw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts))
    return defaultProducts
  }

  const stored: Product[] = JSON.parse(storedRaw)

  // Always use latest seeded products for seeded IDs, but keep any user-added products
  const defaultIds = new Set(defaultProducts.map((p) => p.id))
  const userAdded = stored.filter((p) => !defaultIds.has(p.id))
  const merged = [...defaultProducts, ...userAdded]

  // Persist merged so the UI stays consistent
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(merged))
  return merged
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
