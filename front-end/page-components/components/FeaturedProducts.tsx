"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Product, products } from "@/lib/products";


export default function Featured() {
    const featuredProducts = products.filter((p) => p.featured)

    return(
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Trending Now</h2>
            <p className="text-muted-foreground">Our most loved fragrances this season</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {featuredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}

          </div>

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