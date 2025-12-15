"use client"

import { useAuth } from "@/context/auth-context"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/button"


export default function Register() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { register, user } = useAuth()
    const [successMessage, setSuccessMessage] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams?.get("redirect") || "/"
    
    useEffect(() => {
      if (user) router.push(redirect)
    }, [user, router, redirect])
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
            if (!firstName.trim()) {
        setError("Please enter your first name")
        setLoading(false)
        return
      }
            if (!lastName.trim()) {
        setError("Please enter your last name")
        setLoading(false)
        return
      }
            if (password !== confirmPassword) {
                setError("Passwords do not match")
                setLoading(false)
                return
            }
        await register(email, password, firstName, lastName)

            // Do NOT auto-login. Show a success message and prompt the user to sign in.
            setSuccessMessage("Account created successfully! Please sign in.")
            // Optionally clear sensitive fields
            setPassword("")
            setConfirmPassword("")
            // keep email so user can quickly sign in
        } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
}
    return(
        <section className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-card border rounded-lg p-8">
                        <h1 className="font-serif text-3xl font-bold text-center mb-2">Create Account</h1>
                        <p className="text-center text-muted-foreground mb-8">Join our fragrance community</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="mt-1"
                                    />

                                </div>
                            </div>
                            

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
                            </div>
                            
                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="mt-1 pr-10"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showConfirm ? "Hide password" : "Show password"}
                                        aria-pressed={showConfirm}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowConfirm((p) => !p)}
                                    >
                                        {showConfirm ? <EyeOff aria-hidden="true" className="text-accent" /> : <Eye aria-hidden="true" className="text-accent" />}
                                    </button>
                                </div>
                            </div>
                            
                                                        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}

                                                        {successMessage ? (
                                                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                                                    <p className="text-green-800 font-medium">{successMessage}</p>
                                                                    <div className="mt-3">
                                                                        <a href={`/login?redirect=${encodeURIComponent(redirect)}`} className="inline-block px-4 py-2 bg-accent text-white rounded-md">Go to Sign In</a>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                                                    {loading ? "Please wait..." : "Create Account"}
                                                                </Button>
                                                            )}
                        </form>
                        <div className="mt-6 text-center">
                            <a href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Already have an account? <span className="text-accent font-medium">Sign in</span>
                            </a>
                        </div>

                    </div>
                </div>
            </main>
        </section>
    );
}
