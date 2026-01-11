"use client"

import { useState, useEffect } from "react"
import { Heart, Star, Truck, Shield, RotateCcw, ShoppingCart, Minus, Plus, Edit, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Product as ProductType, convertApiProductToProduct, calculateDiscountedPrice } from "@/lib/products"
import { productApi } from "@/lib/api"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "./ui/button"
import { ProductCard } from "@/page-components/components/ProductCard"

export default function ProductDetail({ product, productId }: { product?: ProductType; productId?: string }) {
  const { addItem,updateQuantity } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user, isAdmin } = useAuth()
  const [selectedVolume, setSelectedVolume] = useState(product?.volumes[0])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  // Update quantity when volume changes to respect stock limit
  useEffect(() => {
    if (selectedVolume && !isAdmin) {
      // Reset quantity to 1 or stock limit when volume changes
      if (selectedVolume.stock > 0) {
        setQuantity(1)
      } else {
        setQuantity(1) // Set to 1 even if out of stock (button will be disabled)
      }
    }
  }, [selectedVolume?.size, isAdmin]) // Only depend on volume size, not quantity

  // Load related products from both API and seed products
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)

  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product) return

      setLoadingRelated(true)
      try {
        // Get related products from API
        let apiRelatedProducts: ProductType[] = []
        try {
          const result = await productApi.getAllPublic(1, 100)
          if (result && result.items) {
            const converted = result.items
              .map(convertApiProductToProduct)
              .filter((p) => p.gender === product.gender && p.id !== product.id)
            apiRelatedProducts = converted.slice(0, 4)
          }
        } catch (apiErr) {
          console.warn("Failed to load related products from API:", apiErr)
        }

        setRelatedProducts(apiRelatedProducts)
      } catch (err) {
        console.error("Error loading related products:", err)
        setRelatedProducts([])
      } finally {
        setLoadingRelated(false)
      }
    }

    loadRelatedProducts()
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">Attempted id: <strong>{productId || "(none)"}</strong></p>
          <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
        </main>
      </div>
    )
  }



  const handleAddToCart = async () => {
    if (!selectedVolume) {
      alert("Please select a volume")
      return
    }
    
    // Check stock limit
    if (!isAdmin && selectedVolume.stock <= 0) {
      alert("This item is out of stock")
      return
    }
    
    // Check if quantity exceeds available stock
    if (!isAdmin && quantity > selectedVolume.stock) {
      alert(`Only ${selectedVolume.stock} items available in stock`)
      setQuantity(selectedVolume.stock)
      return
    }
    
    // Add items based on quantity (but respect stock limit)
    const itemsToAdd = Math.min(quantity, isAdmin ? quantity : selectedVolume.stock)
    
    for (let i = 0; i < itemsToAdd; i++) {
      await addItem({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: (() => {
          const discountPercentage = selectedVolume.discountPercentage || 0
          return discountPercentage > 0
            ? calculateDiscountedPrice(selectedVolume.price, discountPercentage)
            : selectedVolume.price
        })(),
        volume: String(selectedVolume.size),
        image: product.images[0],
      })
    }
    
    // Reset quantity to 1 after adding to cart
    setQuantity(1)
  }

  const favorite = isFavorite(product.id)

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Admin Panel */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border-2 border-amber-300 dark:border-amber-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">Admin Panel</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">You have admin access to manage this product</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900"
                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900"
                  onClick={() => router.push('/admin/products')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div>
            <div className="aspect-square bg-secondary rounded-lg overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square bg-secondary rounded-lg overflow-hidden border-2",
                    selectedImage === index ? "border-primary" : "border-transparent",
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">{product.brand}</p>
            <h1 className="font-serif text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-5 w-5", i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted")}
                  />
                ))}
                <span className="ml-2 font-semibold">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="mb-6">
              {(() => {
                const currentVolume = selectedVolume || product.volumes[0]
                const originalPrice = currentVolume?.price || 0
                const discountPercentage = currentVolume?.discountPercentage || 0
                const discountedPrice = discountPercentage > 0 
                  ? calculateDiscountedPrice(originalPrice, discountPercentage)
                  : originalPrice
                
                return (
                  <div className="flex items-center gap-3">
                    <p className={cn(
                      "text-3xl font-bold",
                      discountPercentage > 0 && "text-primary"
                    )}>
                      ${discountedPrice.toFixed(2)}
                    </p>
                    {discountPercentage > 0 && (
                      <>
                        <p className="text-xl text-muted-foreground line-through">
                          ${originalPrice.toFixed(2)}
                        </p>
                        <span className="px-2 py-1 bg-red-500 text-white text-sm font-semibold rounded">
                          -{discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                )
              })()}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Volume Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-3">Select Volume</label>
              <div className="flex gap-3">
                {product.volumes.map((volume) => (
                  <button
                    key={volume.size}
                    onClick={() => {
                      setSelectedVolume(volume)
                      // Reset quantity to 1 or stock limit when volume changes
                      if (!isAdmin && volume.stock > 0) {
                        setQuantity(Math.min(1, volume.stock))
                      } else if (!isAdmin && volume.stock <= 0) {
                        setQuantity(1)
                      }
                    }}
                    disabled={volume.stock <= 0 && !isAdmin}
                    className={cn(
                      "px-6 py-3 border-2 rounded-lg font-medium transition-colors",
                      selectedVolume?.size === volume.size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary",
                      volume.stock <= 0 && !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                    )}
                  >
                    <div className="font-semibold">{volume.size}ml</div>
                    <div className="text-sm">
                      {(() => {
                        const discountPercentage = volume.discountPercentage || 0
                        const discountedPrice = discountPercentage > 0
                          ? calculateDiscountedPrice(volume.price, discountPercentage)
                          : volume.price
                        const isSelected = selectedVolume?.size === volume.size
                        
                        return (
                          <div className="flex flex-col items-center">
                            <span className={cn(
                              "font-semibold",
                              discountPercentage > 0 && !isSelected && "text-red-600",
                              discountPercentage > 0 && isSelected && "text-white"
                            )}>
                              ${discountedPrice.toFixed(2)}
                            </span>
                            {discountPercentage > 0 && (
                              <span className={cn(
                                "text-xs line-through",
                                isSelected ? "text-white/70" : "text-muted-foreground"
                              )}>
                                ${volume.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </button>
                ))}
              </div>
            </div>


            {/* Quantity Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block font-semibold">Quantity</label>
                {isAdmin && (
                  <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full font-medium">
                    Admin View
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={cn(
                      "p-3 hover:bg-secondary transition-colors rounded-l-lg",
                      quantity <= 1 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      // Admins can add unlimited quantity for testing
                      if (isAdmin) {
                        setQuantity(quantity + 1)
                      } else {
                        if (selectedVolume && quantity < selectedVolume.stock) {
                          setQuantity(quantity + 1)
                        }
                      }
                    }}
                    disabled={!isAdmin && (!selectedVolume || quantity >= selectedVolume.stock)}
                    className={cn(
                      "p-3 hover:bg-secondary transition-colors rounded-r-lg",
                      !isAdmin && (!selectedVolume || quantity >= selectedVolume.stock) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {!isAdmin && selectedVolume && (
                  quantity >= selectedVolume.stock ? (
                    <span className="text-sm text-red-600 font-medium">Max quantity reached ({selectedVolume.stock})</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Available: {selectedVolume.stock - quantity} left</span>
                  )
                )}
                {isAdmin && (
                  <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    No limits for admin
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {selectedVolume && selectedVolume.stock > 0 ? (
                <div>
                  <p className="text-green-600 font-medium">In Stock ({selectedVolume.stock} left)</p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Admin Note: Stock management available in admin panel
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-red-600 font-medium">Out of Stock</p>
                  {isAdmin && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                      Admin: You can still add to cart for testing purposes
                    </p>
                  )}
                </div>
              )}
            </div>
            
            

            

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              {user ? (
                <>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isAdmin && !(selectedVolume && selectedVolume.stock > 0)}
                    className={cn(
                      "flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
                      isAdmin && (!selectedVolume || selectedVolume.stock <= 0) && "bg-amber-500 hover:bg-amber-600"
                    )}
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAdmin && (!selectedVolume || selectedVolume.stock <= 0) ? "Add to Cart (Admin)" : "Add to Cart"}
                  </Button>
                  <Button onClick={() => toggleFavorite(product.id)} variant="outline" size="lg" className="px-6">
                    <Heart className={cn("h-5 w-5", favorite && "fill-accent text-accent")} />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Login to Add to Cart
                  </Button>
                  <Button onClick={() => toggleFavorite(product.id)} variant="outline" size="lg" className="px-6">
                    <Heart className={cn("h-5 w-5", favorite && "fill-accent text-accent")} />
                  </Button>
                </>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Authentic</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">30-Day Returns</p>
              </div>
            </div>

            {/* Fragrance Notes */}
            <div className="mt-8">
              <h3 className="font-serif text-xl font-bold mb-4">Fragrance Notes</h3>
              <div className="space-y-4">
                {product.notes?.top && product.notes.top.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Top Notes</p>
                    <p className="text-muted-foreground">{product.notes.top.join(", ")}</p>
                  </div>
                )}
                {product.notes?.heart && product.notes.heart.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Heart Notes</p>
                    <p className="text-muted-foreground">{product.notes.heart.join(", ")}</p>
                  </div>
                )}
                {product.notes?.base && product.notes.base.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Base Notes</p>
                    <p className="text-muted-foreground">{product.notes.base.join(", ")}</p>
                  </div>
                )}
                {(!product.notes || 
                  (!product.notes.top?.length && !product.notes.heart?.length && !product.notes.base?.length)) && (
                  <p className="text-muted-foreground italic">No fragrance notes available for this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-serif text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>

    </div>
  )
}
