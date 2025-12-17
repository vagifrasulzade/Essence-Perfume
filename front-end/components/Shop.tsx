"use client"

import { type Product, products as seedProducts, convertApiProductToProduct } from "@/lib/products"
import { productApi } from "@/lib/api"
import { Button } from "@/components/ui/button"

import { useState, useMemo, useEffect, useCallback } from "react"
import { usePersist, DEFAULT, type FilterState } from "../hooks/usePersist"

import SearchFilter from "./shop/Search"
import BrandFilter from "./shop/Brand"
import GenderFilter from "./shop/Gender"
import RatingFilter from "./shop/Rating"
import PriceFilter from "./shop/Price"
import ActiveFilter from "./shop/Active"
import Sort from "./shop/Sort"
import Mobile from "./shop/Mobile"
import { ProductCard } from "@/page-components/components/ProductCard"

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { state, setState } = usePersist(DEFAULT)
  
  // Destructure state from usePersist
  const {
    searchQuery,
    selectedBrands,
    selectedGenders,
    priceRange,
    minRating,
    sortBy,
    currentPage,
    itemsPerPage,
  } = state

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  
  // Calculate max price from products dynamically
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 350
    const allPrices = products.flatMap(p => p.volumes.map(v => v.price))
    const max = Math.max(...allPrices, 350)
    // Round up to nearest 50 for cleaner UI
    return Math.ceil(max / 50) * 50
  }, [products])
  
  // Update price range max when maxPrice changes
  useEffect(() => {
    if (maxPrice > 350 && state.priceRange[1] === 350) {
      setState((s: FilterState) => ({ ...s, priceRange: [0, maxPrice] }))
    }
  }, [maxPrice, setState, state.priceRange])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load products from both API and products.ts
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        // Get all products from API - fetch all pages
        let apiProducts: Product[] = []
        try {
          // Fetch first page to get total pages info
          let page = 1
          let hasMorePages = true
          const pageSize = 100
          
          console.log("🔄 Loading API products...")
          
          while (hasMorePages) {
            const apiResult = await productApi.getAllPublic(page, pageSize)
            console.log(`📄 Page ${page} API Result:`, apiResult)
            
            if (apiResult && apiResult.items) {
              const pageProducts = apiResult.items.map(convertApiProductToProduct)
              console.log(`✅ Page ${page} products (${pageProducts.length}):`, pageProducts)
              
              // Log gender distribution
              const genderCount = pageProducts.reduce((acc: any, p: any) => {
                acc[p.gender] = (acc[p.gender] || 0) + 1
                return acc
              }, {})
              console.log(`📊 Gender distribution on page ${page}:`, genderCount)
              
              apiProducts = [...apiProducts, ...pageProducts]
              
              // Check if there are more pages
              if (apiResult.meta && apiResult.meta.totalPages) {
                hasMorePages = page < apiResult.meta.totalPages
                console.log(`📑 Total pages: ${apiResult.meta.totalPages}, Current: ${page}, HasMorePages: ${hasMorePages}`)
                page++
              } else {
                hasMorePages = false
              }
            } else {
              console.warn("❌ No items in API result")
              hasMorePages = false
            }
          }
          
          console.log("🎯 Total API products loaded:", apiProducts.length)
          const apiGenderCount = apiProducts.reduce((acc: any, p: any) => {
            acc[p.gender] = (acc[p.gender] || 0) + 1
            return acc
          }, {})
          console.log("📊 Final API gender distribution:", apiGenderCount)
          
        } catch (apiError) {
          console.error("❌ API products failed:", apiError)
          console.warn("Using only seed products")
        }
        
        // Merge API products with seed products
        // Remove duplicates (same ID) - API products take priority
        const apiProductIds = new Set(apiProducts.map(p => p.id))
        const uniqueSeedProducts = seedProducts.filter(p => !apiProductIds.has(p.id))
        const mergedProducts = [...apiProducts, ...uniqueSeedProducts]
        
        console.log("📦 Final merged products:", {
          apiProducts: apiProducts.length,
          uniqueSeedProducts: uniqueSeedProducts.length,
          total: mergedProducts.length
        })
        
        setProducts(mergedProducts)
      } catch (error: any) {
        console.error("Error loading products:", error)
        // Fallback to seed products on error
        setProducts(seedProducts)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])


  const clearFilters = () => {
    setState((s: FilterState) => ({
      ...s,
      searchQuery: "",
      selectedBrands: [],
      selectedGenders: [],
      priceRange: [0, Math.max(350, maxPrice)],
      minRating: 0,
      currentPage: 1,
    }))
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <SearchFilter 
        value={searchQuery} 
        onChange={(v: string) => setState((s: FilterState) => ({ ...s, searchQuery: v, currentPage: 1 }))} 
      />
      <BrandFilter 
        selectedBrands={selectedBrands} 
        onChange={(brands: string[]) => setState((s: FilterState) => ({ ...s, selectedBrands: brands, currentPage: 1 }))} 
      />
      <GenderFilter 
        selectedGenders={selectedGenders} 
        setSelectedGenders={(genders: string[]) => setState((s: FilterState) => ({ ...s, selectedGenders: genders, currentPage: 1 }))}
        products={products}
      />
      <PriceFilter 
        value={priceRange} 
        onChange={(range: [number, number]) => setState((s: FilterState) => ({ ...s, priceRange: range, currentPage: 1 }))} 
        maxPrice={maxPrice} 
      />
      <RatingFilter 
        value={minRating} 
        onChange={(r: number) => setState((s: FilterState) => ({ ...s, minRating: r, currentPage: 1 }))} 
      />
      <ActiveFilter
        selectedBrands={selectedBrands}
        selectedVolumes={[]}
        selectedGenders={selectedGenders}
        onRemoveBrand={(b: string) => setState((s: FilterState) => ({ ...s, selectedBrands: s.selectedBrands.filter((x: string) => x !== b), currentPage: 1 }))}
        onRemoveVolume={() => {}}
        onRemoveGender={(g: string) => setState((s: FilterState) => ({ ...s, selectedGenders: s.selectedGenders.filter((x: string) => x.toLowerCase() !== g.toLowerCase()), currentPage: 1 }))}
      />
      <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
        Clear All Filters
      </Button>
    </div>
  )


  // Helper function to sort products
  const sortProducts = useCallback((productsToSort: Product[]) => {
    const sorted = [...productsToSort]
    switch (sortBy) {
      case "price-low":
        sorted.sort((a: Product, b: Product) => {
          const minPriceA = Math.min(...a.volumes.map((v) => v.price))
          const minPriceB = Math.min(...b.volumes.map((v) => v.price))
          return minPriceA - minPriceB
        })
        break
      case "price-high":
        sorted.sort((a: Product, b: Product) => {
          const maxPriceA = Math.max(...a.volumes.map((v) => v.price))
          const maxPriceB = Math.max(...b.volumes.map((v) => v.price))
          return maxPriceB - maxPriceA
        })
        break
      case "rating":
        sorted.sort((a: Product, b: Product) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case "name":
        sorted.sort((a: Product, b: Product) => a.name.localeCompare(b.name))
        break
      default:
        break
    }
    return sorted
  }, [sortBy])

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    console.log("🔍 Filtering products...", {
      totalProducts: products.length,
      searchQuery: debouncedSearchQuery,
      selectedBrands,
      selectedGenders,
      priceRange,
      minRating
    })
    
    // Log gender distribution before filtering
    const genderCountBefore = filtered.reduce((acc: any, p: any) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1
      return acc
    }, {})
    console.log("📊 Gender distribution BEFORE filtering:", genderCountBefore)

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      filtered = filtered.filter((product: Product) => {
        const searchLower = debouncedSearchQuery.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower)
        )
      })
      console.log("🔎 After search filter:", filtered.length)
    }


    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product: Product) => 
        selectedBrands.includes(product.brand)
      )
      console.log("🏷️ After brand filter:", filtered.length)
    }

    // Filter by gender
    if (selectedGenders.length > 0) {
      filtered = filtered.filter((product: Product) => {
        const prodGender = (product.gender || "").toString().toLowerCase()
        return selectedGenders.some((g: string) => g.toLowerCase() === prodGender)
      })
      console.log("👥 After gender filter:", filtered.length)
    }

    // Filter by price range
    const beforePriceFilter = filtered.length
    filtered = filtered.filter((product: Product) => {
      const hasMatchingVolume = product.volumes.some((v) => v.price >= priceRange[0] && v.price <= priceRange[1])
      if (!hasMatchingVolume) {
        console.log(`❌ Product filtered out by price: ${product.name} (${product.gender})`, {
          volumes: product.volumes.map(v => v.price),
          priceRange
        })
      }
      return hasMatchingVolume
    })
    console.log(`💰 After price filter (${priceRange[0]}-${priceRange[1]}):`, {
      before: beforePriceFilter,
      after: filtered.length,
      removed: beforePriceFilter - filtered.length
    })

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter((product: Product) => 
        (product.rating ?? 0) >= minRating
      )
      console.log("⭐ After rating filter:", filtered.length)
    }
    
    // Log gender distribution after filtering
    const genderCountAfter = filtered.reduce((acc: any, p: any) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1
      return acc
    }, {})
    console.log("📊 Gender distribution AFTER filtering:", genderCountAfter)
    console.log("✅ Final filtered products:", filtered.length)

      return sortProducts(filtered)
  }, [products, selectedBrands, selectedGenders, priceRange, minRating, debouncedSearchQuery, sortProducts])

  // Pagination helper
  const getPaginatedProducts = (productsToPage: Product[]) => {
    const startIdx = (currentPage - 1) * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return productsToPage.slice(startIdx, endIdx)
  }

  const getTotalPages = (productsCount: number) => {
    return Math.ceil(productsCount / itemsPerPage)
  }



  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <section className="bg-linear-to-b from-muted/30 to-background py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Shop All Perfumes</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our complete collection of luxury fragrances, carefully curated for every style and occasion
              </p>
            </div>
          </section>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-linear-to-b from-muted/30 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Shop All Perfumes</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of luxury fragrances, carefully curated for every style and occasion
            </p>
          </div>
        </section>


        <div className="container mx-auto px-4 py-12">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32">
                <FilterContent />
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <Mobile>
                  <FilterContent />
                </Mobile>

                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">{filteredProducts.length} products</p>
                  
                  {/* Items per page selector */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="itemsPerPage" className="text-sm text-muted-foreground">
                      Show:
                    </label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        setState((s: FilterState) => ({ ...s, itemsPerPage: newValue, currentPage: 1 }))
                      }}
                      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="6">6</option>
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                    </select>
                  </div>
                </div>

                <Sort 
                  sortBy={sortBy} 
                  setSortBy={(v: string) => setState((s: FilterState) => ({ ...s, sortBy: v }))} 
                />
              </div>

              {/* Active Filters */}
              <ActiveFilter
                selectedBrands={selectedBrands}
                selectedVolumes={[]}
                selectedGenders={selectedGenders}
                onRemoveBrand={(b: string) => setState((s: FilterState) => ({ ...s, selectedBrands: s.selectedBrands.filter((x: string) => x !== b), currentPage: 1 }))}
                onRemoveVolume={() => {}}
                onRemoveGender={(g: string) => setState((s: FilterState) => ({ ...s, selectedGenders: s.selectedGenders.filter((x: string) => x.toLowerCase() !== g.toLowerCase()), currentPage: 1 }))}
              />

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getPaginatedProducts(filteredProducts).map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setState((s: FilterState) => ({ ...s, currentPage: Math.max(1, s.currentPage - 1) }))}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: getTotalPages(filteredProducts.length) }).map((_, idx) => (
                      <Button
                        key={idx + 1}
                        variant={currentPage === idx + 1 ? "default" : "outline"}
                        onClick={() => setState((s: FilterState) => ({ ...s, currentPage: idx + 1 }))}
                      >
                        {idx + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      disabled={currentPage === getTotalPages(filteredProducts.length)}
                      onClick={() => setState((s: FilterState) => ({ ...s, currentPage: s.currentPage + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No products found matching your filters</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
