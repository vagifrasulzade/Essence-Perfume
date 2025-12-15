"use client";
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Logo from './Logo';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import Link from 'next/link';
import Image from 'next/image';
import { products as seedProducts, convertApiProductToProduct, type Product } from '@/lib/products';
import { productApi } from '@/lib/api';

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchBar ({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Debounce search query (but not on initial load)
  useEffect(() => {
    if (isInitialLoad) {
      setDebouncedQuery(query)
      setIsInitialLoad(false)
      return
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, isInitialLoad])

  // Load products from API
  useEffect(() => {
    // Only load when modal is open
    if (!open) return

    const loadProducts = async () => {
      setLoading(true)
      try {
        const search = debouncedQuery.trim() || undefined
        
        // Get products from API
        let apiProducts: Product[] = []
        try {
          const apiResult = await productApi.getAllPublic(1, 100, search)
          if (apiResult && apiResult.items) {
            apiProducts = apiResult.items.map(convertApiProductToProduct)
          }
        } catch (apiError) {
          console.warn("API products failed, using seed products:", apiError)
        }
        
        // If search query exists, filter seed products too
        let filteredSeedProducts = seedProducts
        if (search) {
          const searchLower = search.toLowerCase()
          filteredSeedProducts = seedProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.brand.toLowerCase().includes(searchLower) ||
            p.gender.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower))
          )
        }
        
        // Merge API products with seed products (remove duplicates)
        const apiProductIds = new Set(apiProducts.map(p => p.id))
        const uniqueSeedProducts = filteredSeedProducts.filter(p => !apiProductIds.has(p.id))
        const mergedProducts = [...apiProducts, ...uniqueSeedProducts]
        
        setResults(mergedProducts)
      } catch (error) {
        console.error("Error loading products:", error)
        // Fallback to seed products on error
        if (debouncedQuery.trim()) {
          const searchLower = debouncedQuery.toLowerCase()
          const filtered = seedProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.brand.toLowerCase().includes(searchLower) ||
            p.gender.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower))
          )
          setResults(filtered)
        } else {
          setResults(seedProducts)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [debouncedQuery, open])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      setDebouncedQuery("")
      setIsInitialLoad(true)
    }
  }, [open])

 

  
  
  return (
      <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 bg-[#f2dfc4]">
        <DialogTitle className="sr-only">Search Perfumes</DialogTitle>
        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Logo />
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search perfumes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-lg bg-white/80 backdrop-blur border-0 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#dbbd8b]"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[400px] overflow-y-auto bg-white">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-2">
              {results.slice(0, 8).map((product) => {
                // Get minimum price from volumes
                const minPrice = product.volumes && product.volumes.length > 0
                  ? Math.min(...product.volumes.map(v => v.price))
                  : null

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <div className="text-right">
                      {minPrice !== null ? (
                        <p className="font-semibold">${minPrice.toFixed(2)}</p>
                      ) : typeof product.price === "number" ? (
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Price unavailable</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No perfumes found matching "{query}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    
  );
}