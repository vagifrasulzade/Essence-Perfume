import { LayoutDashboard, LogOut, Package, ShoppingBag, MessageSquare, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/sales", label: "Sales", icon: Tag },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  ]

  return (
    <nav className="w-64 bg-background border-r min-h-screen p-6">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Perfume Shop</p>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="mt-auto pt-8">
        <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  );
}
