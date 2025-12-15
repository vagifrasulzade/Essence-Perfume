"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CreditCard, Lock } from "lucide-react"
import { orderApi } from "@/lib/api"

const countries = [
  { name: "Azerbaijan", flag: "🇦🇿" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "Georgia", flag: "🇬🇪" },
  { name: "Kazakhstan", flag: "🇰🇿" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "China", flag: "🇨🇳" },
  { name: "India", flag: "🇮🇳" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Bulgaria", flag: "🇧🇬" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "Israel", flag: "🇮🇱" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "New Zealand", flag: "🇳🇿" },
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
    }
  }, [user, router])

  const [formData, setFormData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: (user as any)?.address || "",
    city: (user as any)?.city || "",
    state: (user as any)?.state || "",
    zipCode: (user as any)?.zipCode || "",
    country: (user as any)?.country || "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Contact Information validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // Shipping Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Street address is required"
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "Please enter a valid city"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    } else if (formData.state.trim().length < 2) {
      newErrors.state = "Please enter a valid state"
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    } else if (!/^\d{4}$/.test(formData.zipCode.replace(/\s/g, ""))) {
      newErrors.zipCode = "Please enter a valid 4-digit ZIP code"
    }

    // Payment validation
    // Card number: exactly 16 digits (spaces allowed in input)
    const cardDigits = formData.cardNumber.replace(/\s/g, "")
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(cardDigits)) {
      newErrors.cardNumber = "Card number must be exactly 16 digits"
    }

    // Expiry: format MM/YY and not in the past (this year or later)
    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = "Please enter expiry date in MM/YY format"
    } else {
      const [mmStr, yyStr] = formData.cardExpiry.split("/")
      const mm = parseInt(mmStr, 10)
      const yy = parseInt(yyStr, 10)
      const monthValid = mm >= 1 && mm <= 12
      const now = new Date()
      const currentYearYY = now.getFullYear() % 100
      const currentMonth = now.getMonth() + 1
      if (!monthValid) {
        newErrors.cardExpiry = "Invalid month"
      } else if (yy < currentYearYY || (yy === currentYearYY && mm < currentMonth)) {
        newErrors.cardExpiry = "Card is expired"
      }
    }

    // CVC: exactly 3 digits
    if (!formData.cardCvc.trim()) {
      newErrors.cardCvc = "CVC is required"
    } else if (!/^\d{3}$/.test(formData.cardCvc)) {
      newErrors.cardCvc = "CVC must be 3 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (!user) return
    
    if (items.length === 0) {
      alert("Your cart is empty")
      return
    }
    
    setLoading(true)

    try {
      // Create order via API
      const order = await orderApi.create({
        items: items.map((item) => ({
          productId: parseInt(item.id, 10),
          volume: Number(item.volume),
          quantity: item.quantity,
        })),
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      })

      // Clear cart after successful order
      await clearCart()
      setLoading(false)
      router.push(`/order-success?orderId=${order.id}`)
    } catch (error: any) {
      console.error("Error creating order:", error)
      setLoading(false)
      
      let errorMessage = "Failed to create order"
      if (error.message) {
        errorMessage = error.message
      } else if (error.data?.error) {
        errorMessage = error.data.error
      } else if (error.data?.errors && Array.isArray(error.data.errors)) {
        errorMessage = error.data.errors.join("\n")
      }
      
      alert(`Order failed: ${errorMessage}`)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </main>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some items before checking out</p>
          <Button size="lg" onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </main>
      </div>
    )
  }

  return (
    <section className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-serif text-2xl font-bold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-serif text-2xl font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className={`mt-1 ${errors.address ? "border-red-500" : ""}`}
                    />
                    {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={`mt-1 ${errors.city ? "border-red-500" : ""}`}
                      />
                      {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                      >
                        <SelectTrigger className={`mt-1 ${errors.country ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Select a country">
                            {formData.country && (
                              <span className="flex items-center gap-2">
                                <span className="text-lg">{countries.find(c => c.name === formData.country)?.flag}</span>
                                <span>{formData.country}</span>
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                              <span className="flex items-center gap-2">
                                <span className="text-lg">{country.flag}</span>
                                <span>{country.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className={`mt-1 ${errors.state ? "border-red-500" : ""}`}
                      />
                      {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        maxLength={5}
                        className={`mt-1 ${errors.zipCode ? "border-red-500" : ""}`}
                      />
                      {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      maxLength={19}
                      className={`mt-1 ${errors.cardNumber ? "border-red-500" : ""}`}
                    />
                    {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        required
                        maxLength={5}
                        className={`mt-1 ${errors.cardExpiry ? "border-red-500" : ""}`}
                      />
                      {errors.cardExpiry && <p className="text-sm text-red-500 mt-1">{errors.cardExpiry}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        required
                        maxLength={4}
                        className={`mt-1 ${errors.cardCvc ? "border-red-500" : ""}`}
                      />
                      {errors.cardCvc && <p className="text-sm text-red-500 mt-1">{errors.cardCvc}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-lg p-6 sticky top-24">
                <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.volume}`} className="flex gap-3">
                      <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.volume} ml × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-lg">${(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </section>
  )
}