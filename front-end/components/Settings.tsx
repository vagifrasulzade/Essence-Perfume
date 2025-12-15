"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2, Trash2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { userApi } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
  })

  if (!user) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required"
    } else if (formData.firstname.trim().length < 2) {
      newErrors.firstname = "First name must be at least 2 characters"
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required"
    } else if (formData.lastname.trim().length < 2) {
      newErrors.lastname = "Last name must be at least 2 characters"
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

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccess(false)
    setErrors({})

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setErrors({ general: "You must be logged in to update your information" })
        setLoading(false)
        return
      }

      // Update all user fields via backend API (including phone and shipping)
      try {
        const response = await userApi.update({
          firstName: formData.firstname,
          lastName: formData.lastname,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: formData.zipCode || null,
          country: formData.country || null,
        })

        // Backend update successful - update all fields from backend response
        if (response.user) {
          updateUser({
            firstname: response.user.firstName || formData.firstname,
            lastname: response.user.lastName || formData.lastname,
            email: response.user.email || formData.email,
            phone: response.user.phone || formData.phone,
            address: response.user.address || formData.address,
            city: response.user.city || formData.city,
            state: response.user.state || formData.state,
            zipCode: response.user.zipCode || formData.zipCode,
            country: response.user.country || formData.country,
          })
        }

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (apiError: any) {
        console.error("Backend API error:", apiError)
        
        // Handle API errors
        if (apiError.status === 401) {
          setErrors({ general: "Unauthorized. Please login again." })
          localStorage.removeItem("token")
          localStorage.removeItem("currentUser")
          setTimeout(() => {
            window.location.href = "/login"
          }, 2000)
          return
        }
        
        if (apiError.data?.errors && Array.isArray(apiError.data.errors)) {
          const errorMessages: Record<string, string> = {}
          apiError.data.errors.forEach((error: string) => {
            if (error.includes("FirstName")) {
              errorMessages.firstname = error.split(":")[1] || "Invalid first name"
            } else if (error.includes("LastName")) {
              errorMessages.lastname = error.split(":")[1] || "Invalid last name"
            } else if (error.includes("Email")) {
              errorMessages.email = error.split(":")[1] || "Invalid email"
            } else if (error.includes("Phone")) {
              errorMessages.phone = error.split(":")[1] || "Invalid phone"
            } else if (error.includes("Address")) {
              errorMessages.address = error.split(":")[1] || "Invalid address"
            } else if (error.includes("City")) {
              errorMessages.city = error.split(":")[1] || "Invalid city"
            } else if (error.includes("State")) {
              errorMessages.state = error.split(":")[1] || "Invalid state"
            } else if (error.includes("ZipCode")) {
              errorMessages.zipCode = error.split(":")[1] || "Invalid zip code"
            } else if (error.includes("Country")) {
              errorMessages.country = error.split(":")[1] || "Invalid country"
            } else {
              errorMessages.general = error
            }
          })
          setErrors(errorMessages)
          return
        }
        
        setErrors({ general: apiError.message || "Failed to update user information" })
      }
    } catch (error) {
      console.error("Update user error:", error)
      setErrors({ general: "Failed to update user information" })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordErrors({})
    
    // Validate password fields
    if (!formData.currentPassword.trim()) {
      setPasswordErrors({ currentPassword: "Current password is required" })
      return
    }

    if (!formData.newPassword.trim()) {
      setPasswordErrors({ newPassword: "New password is required" })
      return
    }

    if (formData.newPassword.length < 6) {
      setPasswordErrors({ newPassword: "New password must be at least 6 characters" })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordErrors({ confirmPassword: "Passwords do not match" })
      return
    }

    setPasswordLoading(true)
    setPasswordSuccess(false)

    try {
      await userApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      setPasswordSuccess(true)
      setPasswordErrors({})
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error: any) {
      console.error("Change password error:", error)
      
      if (error.data?.errors && Array.isArray(error.data.errors)) {
        const errorMessages: Record<string, string> = {}
        error.data.errors.forEach((err: string) => {
          if (err.includes("CurrentPassword")) {
            errorMessages.currentPassword = err.split(":")[1] || "Current password is incorrect"
          } else if (err.includes("NewPassword")) {
            errorMessages.newPassword = err.split(":")[1] || "Invalid new password"
          } else {
            errorMessages.general = err
          }
        })
        setPasswordErrors(errorMessages)
      } else {
        setPasswordErrors({ general: error.message || "Failed to change password. Please try again." })
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // If no token, just do local cleanup and logout
        const usersData = localStorage.getItem("users")
        const users = usersData ? JSON.parse(usersData) : []
        const filteredUsers = users.filter((u: any) => u.id !== user.id)
        localStorage.setItem("users", JSON.stringify(filteredUsers))
        logout()
        router.push("/")
        return
      }

      // Call backend API to delete user
      try {
        await userApi.deleteAccount()
      } catch (apiError: any) {
        if (apiError.status === 401) {
          // Unauthorized - token expired or invalid
          localStorage.removeItem("token")
          localStorage.removeItem("currentUser")
          logout()
          router.push("/login")
          return
        }
        
        // Show error message but still allow local cleanup
        console.error("Failed to delete account:", apiError.message || "Unknown error")
      }

      // Clean up local storage
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []
    const filteredUsers = users.filter((u: any) => u.id !== user.id)
    localStorage.setItem("users", JSON.stringify(filteredUsers))

      // Remove token and user data
      localStorage.removeItem("token")
      localStorage.removeItem("currentUser")

    // Logout and redirect
    logout()
    router.push("/")
    } catch (error) {
      console.error("Delete account error:", error)
      // Even if backend fails, clean up locally
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []
      const filteredUsers = users.filter((u: any) => u.id !== user.id)
      localStorage.setItem("users", JSON.stringify(filteredUsers))
      localStorage.removeItem("token")
      localStorage.removeItem("currentUser")
      logout()
      router.push("/")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  placeholder="Enter your First name"
                  className={errors.firstname ? "border-red-500" : ""}
                />
                {errors.firstname && <p className="text-sm text-red-500">{errors.firstname}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  placeholder="Enter your Last name"
                  className={errors.lastname ? "border-red-500" : ""}
                />
                {errors.lastname && <p className="text-sm text-red-500">{errors.lastname}</p>}
              </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
            </div>
            
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
            <CardDescription>Save your address for faster checkout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your street address"
                className={`mt-1 ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter your city"
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
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.name} value={country.name}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
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
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter your state"
                  className={`mt-1 ${errors.state ? "border-red-500" : ""}`}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="Enter your ZIP code"
                  maxLength={5}
                  className={`mt-1 ${errors.zipCode ? "border-red-500" : ""}`}
                />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, currentPassword: e.target.value })
                    setPasswordErrors({ ...passwordErrors, currentPassword: "" })
                  }}
                  placeholder="Enter current password"
                  className={`pr-10 ${passwordErrors.currentPassword ? "border-red-500" : ""}`}
                  disabled={passwordLoading}
                />
                <button
                  type="button"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  aria-pressed={showCurrentPassword}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  disabled={passwordLoading}
                >
                  {showCurrentPassword ? <EyeOff aria-hidden="true" className="text-accent" /> : <Eye aria-hidden="true" className="text-accent" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, newPassword: e.target.value })
                      setPasswordErrors({ ...passwordErrors, newPassword: "" })
                    }}
                    placeholder="Enter new password"
                    className={`pr-10 ${passwordErrors.newPassword ? "border-red-500" : ""}`}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    aria-pressed={showNewPassword}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword((p) => !p)}
                    disabled={passwordLoading}
                  >
                    {showNewPassword ? <EyeOff aria-hidden="true" className="text-accent" /> : <Eye aria-hidden="true" className="text-accent" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value })
                      setPasswordErrors({ ...passwordErrors, confirmPassword: "" })
                    }}
                    placeholder="Confirm new password"
                    className={`pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : ""}`}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    aria-pressed={showConfirmPassword}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    disabled={passwordLoading}
                  >
                    {showConfirmPassword ? <EyeOff aria-hidden="true" className="text-accent" /> : <Eye aria-hidden="true" className="text-accent" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            {passwordErrors.general && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {passwordErrors.general}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg">
                Password changed successfully!
              </div>
            )}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handlePasswordChange}
                disabled={passwordLoading}
                variant="outline"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        

        {/* Error Message */}
        {errors.general && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          {success && <p className="text-sm text-green-600 font-medium">Changes saved successfully!</p>}
        </div>
      </form>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all associated data</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers, including your order history and saved preferences.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}