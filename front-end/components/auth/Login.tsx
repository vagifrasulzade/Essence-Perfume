"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get("redirect") || "/"

  useEffect(() => {
    if (user) {
      const dest = user.role === "admin" ? "/admin" : redirect
      router.push(dest)
    }
  }, [user, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      const saved = localStorage.getItem("currentUser")
      const parsed = saved ? JSON.parse(saved) : null
      const dest = parsed?.role === "admin" ? "/admin" : redirect
      router.push(dest)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
  <section className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-lg p-8">
            <h1 className="font-serif text-3xl font-bold text-center mb-2">Welcome Back</h1>
            <p className="text-center text-muted-foreground mb-8">Sign in to your account</p>
            
            
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="email">Email</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1"
              />
            </div>
    
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="mt-1 pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="text-accent" /> : <Eye aria-hidden="true" className="text-accent" />}
                </button>
              </div>
            </div>
    
            {error && (
              <div role="alert" className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
    
            <Button type="submit" className="w-full" size="lg" disabled={loading} aria-busy={loading} aria-disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </Button>
          </form>
            <div className="mt-6 text-center">
              <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Don't have an account? <span className="text-accent font-medium">Sign up</span>
              </Link>
            </div>
            </div>
          </div>
      </main>
    </section>
  )
}

