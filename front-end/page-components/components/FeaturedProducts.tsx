"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Product, convertApiProductToProduct } from "@/lib/products";
import { productApi } from "@/lib/api";
import { useState, useEffect } from "react";


export default function Featured() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadFeaturedProducts = async () => {
            setLoading(true)
            try {
                // Get all products from API - fetch all pages to get featured ones
                let allProducts: Product[] = []
                let page = 1
                let hasMorePages = true
                const pageSize = 100
                
                while (hasMorePages) {
                    const result = await productApi.getAllPublic(page, pageSize)
                    
                    if (result && result.items) {
                        const pageProducts = result.items
                            .filter(p => p.featured)
                            .map(convertApiProductToProduct)
                        allProducts = [...allProducts, ...pageProducts]
                        
                        // Check if there are more pages
                        if (result.meta && result.meta.totalPages) {
                            hasMorePages = page < result.meta.totalPages
                            page++
                        } else {
                            hasMorePages = false
                        }
                    } else {
                        hasMorePages = false
                    }
                }
                
                // Limit to 4 featured products
                setFeaturedProducts(allProducts.slice(0, 4))
            } catch (error) {
                console.error("Error loading featured products:", error)
                setFeaturedProducts([])
            } finally {
                setLoading(false)
            }
        }

        loadFeaturedProducts()
    }, [])

    return(
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Trending Now</h2>
            <p className="text-muted-foreground">Our most loved fragrances this season</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" size="lg" className=" hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />

              </Button>
            </Link>
          </div>
        </section>
    );
}