"use client"

import AdminNav from "@/components/Admin-nav";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [isInitializing, setIsInitializing] = useState(true)
  
  useEffect(() => {
    // Check if user data exists in localStorage (for immediate check)
    if (typeof window === "undefined") return
    
    const savedUser = localStorage.getItem("currentUser")
    const savedToken = localStorage.getItem("token")
    
    // If no saved data, user is definitely not logged in
    if (!savedUser || !savedToken) {
      setIsInitializing(false)
      if (!user) {
        router.push("/login?redirect=/admin")
      }
      return () => {} // Return empty cleanup function
    }
    
    // If we have saved data, wait for auth context to load
    // Give it a moment to initialize
    const timer = setTimeout(() => {
      setIsInitializing(false)
      
      if (!user) {
        router.push("/login?redirect=/admin")
        return
      }
      
      if (!isAdmin) {
        router.push("/")
        return
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [user, isAdmin, router])

  // Show loading while checking authentication
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If not authenticated or not admin, show nothing (redirect will happen)
  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
