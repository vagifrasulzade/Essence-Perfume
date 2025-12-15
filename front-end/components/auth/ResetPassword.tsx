"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Read email from URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const emailParam = params.get("email")
      if (emailParam) {
        setEmail(emailParam)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Client-side validation
    if (!email || !otp || !newPassword || !confirmPassword) {
      setError("All fields are required")
      return
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits")
      return
    }

    // Validate new password format
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    // Check if new password starts with uppercase
    if (!/^[A-Z]/.test(newPassword)) {
      setError("New password must start with an uppercase letter")
      return
    }

    // Check if new password contains at least one digit
    if (!/\d/.test(newPassword)) {
      setError("New password must contain at least one digit")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match")
      return
    }

    setLoading(true)
    
    // Simulate API call (frontend only)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
      setNewPassword("")
      setConfirmPassword("")
      setOtp("")
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-lg p-8">
            <Link 
              href="/forgot-password" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>

            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="font-serif text-3xl font-bold text-center mb-2">Reset Password</h1>
            <p className="text-center text-muted-foreground mb-8">
              Enter the OTP sent to your email and your new password
            </p>

            {success ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm p-4 rounded-lg">
                  <p className="font-medium">Password reset successfully!</p>
                  <p className="mt-2">
                    Your password has been updated. Redirecting to login...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="mt-1 text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      aria-pressed={showNewPassword}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword((p) => !p)}
                    >
                      {showNewPassword ? (
                        <EyeOff aria-hidden="true" className="text-accent" />
                      ) : (
                        <Eye aria-hidden="true" className="text-accent" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters, start with uppercase, and contain a digit
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      aria-pressed={showConfirmPassword}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff aria-hidden="true" className="text-accent" />
                      ) : (
                        <Eye aria-hidden="true" className="text-accent" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div role="alert" className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  disabled={loading}
                  aria-busy={loading}
                  aria-disabled={loading}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Remember your password? <span className="text-accent font-medium">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </section>
  )
}

