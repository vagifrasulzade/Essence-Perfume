"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { favoritesApi } from "@/lib/api"
import { useAuth } from "./auth-context"

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (id: string) => Promise<void>
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const { user } = useAuth()

  // Load favorites from API or localStorage on mount and when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (typeof window === "undefined") return
      
      // First try to load from localStorage immediately for instant UI
      const saved = localStorage.getItem("favorites")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            setFavorites(parsed)
          }
        } catch (e) {
          console.error("Failed to parse favorites from localStorage", e)
        }
      }
      
      // Then try API to sync with backend (only if user is logged in)
      if (user) {
        try {
          const response = await favoritesApi.getFavorites()
          if (response && response.productIds) {
            // Convert number IDs to strings for compatibility
            const apiFavorites = response.productIds.map((id) => String(id))
            
            // Get saved favorites from localStorage (includes both API and seed products)
            const savedFavorites = saved ? (() => {
              try {
                const parsed = JSON.parse(saved)
                return Array.isArray(parsed) ? parsed : []
              } catch {
                return []
              }
            })() : []
            
            // Separate numeric (API) and string (seed) IDs from localStorage
            const savedNumericIds = savedFavorites.filter((id) => !isNaN(parseInt(id, 10)))
            const savedStringIds = savedFavorites.filter((id) => isNaN(parseInt(id, 10)))
            
            // Merge: API favorites (from backend) + localStorage numeric IDs (if not in API) + seed product favorites (string IDs)
            // This ensures we preserve all favorites: API + localStorage numeric + localStorage string
            const apiFavoritesSet = new Set(apiFavorites)
            const savedNumericNotInApi = savedNumericIds.filter((id) => !apiFavoritesSet.has(id))
            const merged = [...apiFavorites, ...savedNumericNotInApi, ...savedStringIds]
            
            // Remove duplicates
            setFavorites(Array.from(new Set(merged)))
          } else {
            // API returned empty, but keep localStorage favorites
            console.log("API returned empty favorites, keeping localStorage favorites")
          }
        } catch (error) {
          console.warn("Favorites API not available, using localStorage only:", error)
          // Already loaded from localStorage above
        }
      }
    }

    loadFavorites()
  }, [user])

  // Save favorites to localStorage as backup whenever favorites change
  useEffect(() => {
    if (typeof window !== "undefined" && favorites.length >= 0) {
      try {
        localStorage.setItem("favorites", JSON.stringify(favorites))
        console.log("Favorites saved to localStorage:", { count: favorites.length, ids: favorites })
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error)
      }
    }
  }, [favorites])

  const toggleFavorite = async (id: string) => {
    // Check if it's a numeric ID (API product) or string ID (seed product)
    const productId = parseInt(id, 10)
    const isNumericId = !isNaN(productId)

    // Optimistically update UI first for instant feedback
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id)
      } else {
        return [...prev, id]
      }
    })

    // Try API first (only for numeric IDs and if user is logged in)
    if (isNumericId && user) {
      try {
        const response = await favoritesApi.toggleFavorite(productId)
        
        if (response && response.productIds) {
          // API succeeded - convert number IDs to strings for compatibility
          const apiFavorites = response.productIds.map((id) => String(id))
          
          // Get string IDs (seed products) from current state
          setFavorites((prev) => {
            const stringIds = prev.filter((fav) => isNaN(parseInt(fav, 10)))
            // Merge: API favorites (numeric IDs) + seed product favorites (string IDs)
            const merged = [...apiFavorites, ...stringIds]
            // Remove duplicates
            return Array.from(new Set(merged))
          })
          return
        }
      } catch (error) {
        console.warn("Failed to toggle favorite via API, using localStorage:", error)
        // Optimistic update already applied, keep it
      }
    }

    // For string IDs or guest users, optimistic update is already applied
    // localStorage will be saved automatically by the useEffect
  }

  const isFavorite = (id: string) => favorites.includes(id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>{children}</FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider")
  return context
}
