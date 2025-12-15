"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import SearchBar from "../components/SearchBar";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import MobileMenu from "../components/MobileMenu";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { useAuth } from "@/context/auth-context";


export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { itemCount } = useCart()
  const { favorites } = useFavorites()
  const { user, logout } = useAuth()

  const displayName = user
    ? (user.firstname || user.lastname
        ? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()
        : (user.email ? user.email.split("@")[0] : "Account"))
    : "Account"

  

  return (
  <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">        
        <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
                <MobileMenu />
                <Logo />

                <nav className="hidden md:flex items-center gap-8 relative">
                  <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                    Home
                  </Link>

                  <Link href="/shop" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                    Shop
                  </Link>
                  
                  

                  <Link href="/service" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                    Service
                  </Link>
                  
                  <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                    About us
                  </Link>
                  <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                    Contact
                  </Link>
                </nav>

                <div className='flex items-center gap-4'>
                  <button onClick={() => setSearchOpen(true)} className="hover:text-accent transition-colors">
                  <Search className="h-5 w-5 hover:text-accent" />
                  </button>


                  <Link href="/cart" className="relative hover:text-primary transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                  </Link>
                  <Link href="/favorites" className="relative hover:text-primary transition-colors">
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                  </Link>
                  {user ? (
                    <div className="relative group hidden md:block">
                      <button className="hover:text-primary transition-colors">
                        <User className="h-5 w-5" />
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="p-4 border-b">
                          <p className="font-medium">{displayName || "No name"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>

                        <div className="p-2">
                          {/* Show My Account only for non-admin users */}
                          {user.role === "user" && (
                            <>
                              <Link href="/account" className="block px-4 py-2 text-sm hover:bg-muted rounded">
                                My Account
                              </Link>

                              <Link href="/account/settings" className="block px-4 py-2 text-sm hover:bg-muted rounded">
                                Settings
                              </Link>
                            </>
                          )}

                          {/* Admin quick links -- visible only to admins */}
                          {user.role === "admin" && (
                            <>
                              <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-muted rounded">
                                Dashboards
                              </Link>
                              <Link href="/admin/products" className="block px-4 py-2 text-sm hover:bg-muted rounded">
                                Products
                              </Link>
                              <Link href="/admin/orders" className="block px-4 py-2 text-sm hover:bg-muted rounded">
                                Orders
                              </Link>
                              <Link href="/admin/messages" className="block px-4 py-2 text-sm hover:bg-muted rounded">
                                Messages
                              </Link>
                            </>
                          )}

                          <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-muted rounded">
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                    ) : (
                    <Link href="/login" className="hover:text-primary transition-colors hidden md:block">
                      <User className="h-5 w-5" />
                    </Link>
                    )}
            </div>

            {/* SearchBar component */}
            <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />

            </div>
        </div>
    </header>
    );
}