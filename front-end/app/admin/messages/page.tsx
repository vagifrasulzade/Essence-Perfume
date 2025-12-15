"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Trash2, Eye, Phone, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ContactMessage {
  id: number
  fullName: string
  email: string
  phone?: string
  subject: string
  message: string
  date: string
  isDeleted?: boolean
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchMessages()
  }, [page, search])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You must be logged in to view messages")
        return
      }

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
      })
      if (search) params.append("search", search)
      
      const response = await fetch(
        `http://localhost:5000/api/admin/contact-messages/all?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          alert("Unauthorized. Please login again.")
          localStorage.removeItem("token")
          localStorage.removeItem("currentUser")
          window.location.href = "/login"
          return
        }
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Failed to fetch messages: ${errorData.error || "Unknown error"}`)
        return
      }

      const result = await response.json()
      if (result.items) {
        setMessages(result.items)
        setTotalPages(result.meta?.totalPages || 1)
      } else if (Array.isArray(result)) {
        setMessages(result)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      alert("Failed to fetch messages. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You must be logged in to delete messages")
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/contact-messages/${id}/soft`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.ok) {
        const result = await response.json()
        alert(result.message || "Message deleted successfully!")
        fetchMessages()
      } else {
        if (response.status === 401) {
          alert("Unauthorized. Please login again.")
          localStorage.removeItem("token")
          localStorage.removeItem("currentUser")
          window.location.href = "/login"
          return
        }
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Failed to delete message: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to delete message:", error)
      alert("Failed to delete message. Please check your connection.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Contact Messages</h1>
          <p className="text-muted-foreground">Manage customer inquiries</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {messages.length} Messages
        </Badge>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name, email, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading messages...</div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No messages found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {messages.map((message) => (
              <Card key={message.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-xl font-bold">{message.fullName}</h3>
                        {message.isDeleted && (
                          <Badge variant="destructive">Deleted</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${message.email}`} className="hover:text-primary">
                            {message.email}
                          </a>
                        </div>
                        
                        {message.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${message.phone}`} className="hover:text-primary">
                              {message.phone}
                            </a>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(message.date).toLocaleString()}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="font-semibold text-sm mb-1">Subject:</p>
                        <p className="text-sm">{message.subject}</p>
                      </div>

                      {selectedMessage?.id === message.id ? (
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="font-semibold text-sm mb-2">Message:</p>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedMessage(
                            selectedMessage?.id === message.id ? null : message
                          )
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(message.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

