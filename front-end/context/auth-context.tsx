"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: number | string
  email: string
  firstname: string
  lastname: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  role: "user" | "admin" | "User" | "Admin"
  password?: string // Store hashed in production
}

interface AuthContextType {
  user: Omit<User, "password"> | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstname: string, lastname: string) => Promise<void>
  logout: () => void
  updateUser: (updatedData: Partial<Omit<User, "password" | "id">>) => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null)

  useEffect(() => {
    // Load saved user and token from localStorage
    const savedUser = localStorage.getItem("currentUser")
    const savedToken = localStorage.getItem("token")

    if (savedUser && savedToken) {
      try {
        const parsed: any = JSON.parse(savedUser)

        // Normalize role to lowercase
        if (parsed.role) {
          parsed.role = parsed.role.toLowerCase() === "admin" ? "admin" : "user"
        }

        // Map backend field names (FirstName, LastName) to frontend (firstname, lastname)
        if (parsed.FirstName && !parsed.firstname) {
          parsed.firstname = parsed.FirstName
        }
        if (parsed.LastName && !parsed.lastname) {
          parsed.lastname = parsed.LastName
        }

        // If we have a legacy `name` field but not firstname/lastname, split it
        if ((!parsed.firstname || !parsed.lastname) && parsed.name) {
          const parts = String(parsed.name).trim().split(/\s+/)
          parsed.firstname = parsed.firstname || parts.shift() || ""
          parsed.lastname = parsed.lastname || parts.join(" ") || ""
        }

        // Verify token is still valid by checking with backend
        verifyTokenAndFetchUser(savedToken, parsed)
      } catch (e) {
        // If parsing fails, clear invalid data
        console.warn("Failed to parse saved currentUser", e)
        localStorage.removeItem("currentUser")
        localStorage.removeItem("token")
      }
    }
  }, [])

  const verifyTokenAndFetchUser = async (token: string, fallbackUser: any) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        // Map backend response to frontend format
        const user: Omit<User, "password"> = {
          id: userData.id,
          email: userData.email,
          firstname: userData.firstName || userData.firstname,
          lastname: userData.lastName || userData.lastname,
          role: (userData.role?.toLowerCase() === "admin" ? "admin" : "user") as "user" | "admin",
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          zipCode: userData.zipCode,
          country: userData.country,
        }
        setUser(user)
        localStorage.setItem("currentUser", JSON.stringify(user))
      } else {
        // Token invalid, clear data
        setUser(null)
        localStorage.removeItem("currentUser")
        localStorage.removeItem("token")
      }
    } catch (error) {
      // Network error, use fallback user if available
      if (fallbackUser) {
        setUser(fallbackUser)
      } else {
        setUser(null)
        localStorage.removeItem("currentUser")
        localStorage.removeItem("token")
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Check if this is an admin login attempt
      const isAdminEmail = email.toLowerCase() === "admin@gmail.com"
      
      // Use admin login endpoint for admin emails, otherwise use regular login
      const loginUrl = isAdminEmail 
        ? "http://localhost:5000/api/admin/auth/login"
        : "http://localhost:5000/api/auth/login"

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(", "))
        }
        // Backend sends specific error messages: "Invalid email" or "Invalid password"
        const errorMessage = data.error || "Login failed. Please try again."
        throw new Error(errorMessage)
      }

      // Extract token and user from response
      const token = data.token
      const userData = data.user

      if (!token || !userData) {
        throw new Error("Invalid response from server")
      }

      // Map backend user format to frontend format
      const user: Omit<User, "password"> = {
        id: userData.id,
        email: userData.email,
        firstname: userData.firstName || userData.firstname,
        lastname: userData.lastName || userData.lastname,
        role: (userData.role?.toLowerCase() === "admin" ? "admin" : "user") as "user" | "admin",
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
      }

      // Save token and user
      setUser(user)
      localStorage.setItem("token", token)
      localStorage.setItem("currentUser", JSON.stringify(user))
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Login failed. Please try again.")
    }
  }

  const register = async (email: string, password: string, firstname: string, lastname: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          email,
          password,
          confirmPassword: password, // Backend requires confirmPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(", "))
        }
        throw new Error(data.error || "Registration failed. Please try again.")
      }

      // Registration successful, user needs to login
      // Do NOT auto-login here. User should sign in manually.
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Registration failed. Please try again.")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
  }

  const updateUser = (updatedData: Partial<Omit<User, "password" | "id">>) => {
    if (!user) return

    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update in users array (if exists)
    const usersData = localStorage.getItem("users")
    if (usersData) {
      try {
        const users: User[] = JSON.parse(usersData)
        const userIndex = users.findIndex((u) => u.id === user.id)
        
        if (userIndex >= 0) {
          users[userIndex] = { ...users[userIndex], ...updatedData }
          localStorage.setItem("users", JSON.stringify(users))
        }
      } catch (e) {
        // If parsing fails, ignore
        console.warn("Failed to update users array:", e)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
