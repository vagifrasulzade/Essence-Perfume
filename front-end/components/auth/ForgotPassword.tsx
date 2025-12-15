"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simple email validation
    if (!email) {
      setError("Please enter your email address.")
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      setLoading(false)
      return
    }

    // Simulate API call (frontend only)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
      setEmail("")
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
              href="/login" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>

            <h1 className="font-serif text-3xl font-bold text-center mb-2">Forgot Password</h1>
            <p className="text-center text-muted-foreground mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {success ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm p-4 rounded-lg">
                  <p className="font-medium">Password reset email sent!</p>
                  <p className="mt-2">
                    If an account with that email exists, a password reset link has been sent to your email.
                  </p>
                </div>
                <div className="text-center">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
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
                  {loading ? "Sending..." : "Send Reset Link"}
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
