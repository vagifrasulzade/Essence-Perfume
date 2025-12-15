"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { User, Package, Heart, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/layout/Header"
import Footer from "@/layout/Footer"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=" + pathname)
    }
  }, [user, router, pathname])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    { href: "/account", label: "Profile", icon: User },
    { href: "/account/orders", label: "My Orders", icon: Package },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/account/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
        <Header />
      <div className="container mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6 sticky top-24">
              <div className="mb-6 pb-6 border-b">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">{user.firstname} {user.lastname}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
