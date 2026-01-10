"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, X, Upload } from "lucide-react"
import { productApi, type ProductUpdateDTO } from "@/lib/api"

type VolumeRow = { size: number; price: number; stock: number }

export default function EditProduct() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const productId = parseInt(params?.id ?? "0")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [volumes, setVolumes] = useState<VolumeRow[]>([
    { size: 30, price: 85, stock: 10 },
    { size: 100, price: 200, stock: 5 },
  ])

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    gender: "women" as "men" | "women" | "kid",
    rating: "4.5",
    reviews: "0",
    description: "",
    topNotes: "",
    heartNotes: "",
    baseNotes: "",
    featured: false,
    discountPercentage: "0",
  })

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId || isNaN(productId)) {
        alert("Invalid product ID!")
        router.push("/admin/products")
        return
      }

      try {
        const product = await productApi.getById(productId)
        console.log("Loaded product:", product)
        
        if (product) {
          setFormData({
            name: product.name || "",
            brand: product.brand || "",
            gender: product.gender || "women",
            rating: String(product.rating || 0),
            reviews: String(product.reviews || 0),
            description: product.description || "",
            topNotes: (product.top || product.notes?.top || []).join(", ") || "",
            heartNotes: (product.heart || product.notes?.heart || []).join(", ") || "",
            baseNotes: (product.base || product.notes?.base || []).join(", ") || "",
            featured: product.featured || false,
            discountPercentage: String(product.discountPercentage ?? 0),
          })
          
          if (product.images && product.images.length > 0) {
            setImages(product.images.map((img: any) => img.url || "").filter(Boolean))
          } else {
            setImages([])
          }
          
          if (product.volumes && product.volumes.length > 0) {
            setVolumes(product.volumes.map((v: any) => ({
              size: v.size || 0,
              price: v.price || 0,
              stock: Number(v.stock ?? 0),
            })))
          } else {
            setVolumes([{ size: 30, price: 85, stock: 0 }])
          }
        } else {
          alert("Product not found!")
          router.push("/admin/products")
        }
      } catch (error: any) {
        console.error("Error loading product:", error)
        alert(`Failed to load product: ${error.message || "Unknown error"}`)
        router.push("/admin/products")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId, router])

  const addImageFromUrl = () => {
    const trimmedUrl = imageUrl.trim()
    if (trimmedUrl) {
      if (trimmedUrl.length > 2000) {
        alert("Image URL cannot exceed 2000 characters. Please use a shorter URL.")
        return
      }
      try {
        new URL(trimmedUrl)
        setImages([...images, trimmedUrl])
        setImageUrl("")
      } catch {
        alert("Please enter a valid URL (e.g., https://example.com/image.jpg)")
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must not exceed 10MB")
      return
    }

    setUploadingImage(true)
    try {
      const result = await productApi.uploadImage(file)
      setImages([...images, result.url])
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      alert(error.message || "Failed to upload image. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const updateVolume = (index: number, field: keyof VolumeRow, value: any) => {
    const updatedVolumes = volumes.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    setVolumes(updatedVolumes)
  }

  const addVolumeRow = () => {
    const newVolumes = [...volumes, { size: 50, price: 120, stock: 0 }]
    // Sort by size (ascending: 30ml, 50ml, 100ml, 200ml)
    newVolumes.sort((a, b) => a.size - b.size)
    setVolumes(newVolumes)
  }
  const removeVolumeRow = (index: number) => {
    if (volumes.length <= 1) {
      alert("At least one volume is required!")
      return
    }
    setVolumes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const cleanedVolumes = volumes
      .filter((v) => v.size > 0 && v.price > 0)
      .map((v) => ({ size: Number(v.size), price: Number(v.price), stock: Number(v.stock ?? 0) }))

    if (cleanedVolumes.length === 0) {
      alert("Please add at least one volume with valid price")
      setSubmitting(false)
      return
    }

    if (images.length === 0) {
      alert("Please add at least one product image")
      setSubmitting(false)
      return
    }

    const invalidImages = images.filter(url => url.length > 2000)
    if (invalidImages.length > 0) {
      alert(`Some image URLs exceed 2000 characters. Please use shorter URLs.`)
      setSubmitting(false)
      return
    }

    const topNotes = formData.topNotes.split(",").map((s) => s.trim()).filter(Boolean)
    const heartNotes = formData.heartNotes.split(",").map((s) => s.trim()).filter(Boolean)
    const baseNotes = formData.baseNotes.split(",").map((s) => s.trim()).filter(Boolean)

    try {
      const productData: ProductUpdateDTO = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        description: formData.description.trim() || undefined,
        gender: formData.gender,
        reviews: Number(formData.reviews || 0),
        rating: Number(formData.rating || 0),
        featured: Boolean(formData.featured),
        discountPercentage: Number(formData.discountPercentage || 0),
        top: topNotes,
        heart: heartNotes,
        base: baseNotes,
        images: images.map((url, index) => ({
          productId: productId,
          url: url,
          publicId: null,
          sort: index + 1,
        })),
        volumes: cleanedVolumes.map((v) => ({
          productId: productId,
          size: v.size,
          price: v.price,
          stock: v.stock,
        })),
      }

      console.log("Sending update data:", {
        volumes: cleanedVolumes,
        volumesCount: cleanedVolumes.length,
        fullData: productData
      })

      const result = await productApi.update(productId, productData)
      console.log("Product updated successfully:", result)
      
      if (result) {
        alert("Product updated successfully!")
        router.push("/admin/products")
      } else {
        alert("Product updated but response format unexpected. Check console for details.")
        console.warn("Unexpected response format:", result)
      }
    } catch (error: any) {
      console.error("Error updating product:", error)
      let errorMessage = "Failed to update product"
      if (error.data) {
        if (error.data.errors && Array.isArray(error.data.errors)) {
          errorMessage = `Validation errors:\n${error.data.errors.join("\n")}`
        } else if (error.data.error) {
          errorMessage = error.data.error
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      alert(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" onClick={() => router.push("/admin/products")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>
      
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">Edit Product</h1>
        <p className="text-muted-foreground">Update perfume listing</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-accent rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="200px"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Paste image URL (e.g., https://example.com/image.jpg)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addImageFromUrl()
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={addImageFromUrl} variant="secondary">
                  Add URL
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                  id="image-upload-edit"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPEG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Rose Noir"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g., Dior"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender Category *</Label>
                <select
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "men" | "women" | "kid" })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kid">Kid</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviews">Reviews Count</Label>
                <Input
                  id="reviews"
                  type="number"
                  min="0"
                  value={formData.reviews}
                  onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A dark and mysterious floral fragrance..."
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
              <Input
                id="discountPercentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                placeholder="e.g., 20 for 20% off"
              />
              <p className="text-xs text-muted-foreground">
                Enter discount percentage (0-100). This will reduce the product prices by the specified percentage.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fragrance Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topNotes">Top Notes (comma separated)</Label>
              <Input
                id="topNotes"
                value={formData.topNotes}
                onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                placeholder="Bergamot, Rose, Pink Pepper"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heartNotes">Heart Notes (comma separated)</Label>
              <Input
                id="heartNotes"
                value={formData.heartNotes}
                onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                placeholder="Jasmine, Oud, Amber"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseNotes">Base Notes (comma separated)</Label>
              <Input
                id="baseNotes"
                value={formData.baseNotes}
                onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                placeholder="Musk, Vanilla, Sandalwood"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volumes & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Add size (ml), price ($), and availability for each volume</p>
              <Button type="button" variant="secondary" size="sm" onClick={addVolumeRow}>
                Add Volume
              </Button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 text-sm font-semibold text-muted-foreground mb-2">
                <div className="col-span-3">Size (ml)</div>
                <div className="col-span-3">Price ($)</div>
                <div className="col-span-3">Stock (qty)</div>
                <div className="col-span-3">Action</div>
              </div>
              {volumes.map((v, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3">
                    <Input
                      type="number"
                      min="1"
                      value={v.size || ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value)
                        updateVolume(i, "size", val)
                      }}
                      placeholder="30"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={v.price || ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value)
                        updateVolume(i, "price", val)
                      }}
                      placeholder="85"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      min="0"
                      value={v.stock ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value)
                        updateVolume(i, "stock", val)
                      }}
                      placeholder="10"
                    />
                  </div>
                  <div className="col-span-3">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVolumeRow(i)}
                      disabled={volumes.length === 1}
                      className="w-full"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}