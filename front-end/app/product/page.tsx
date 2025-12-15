import Link from "next/link"
import { Button } from "@/components/ui/button"
import MainLayout from "@/layout/MainLayout"

export default function ProductIndexPage() {
  return (
    <MainLayout>
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="font-serif text-4xl font-bold mb-4">Select a Product</h1>
          <p className="mb-6 text-muted-foreground">To view a product, open a product link or visit the shop.</p>
          <Link href="/shop">
            <Button>Go to Shop</Button>
          </Link>
        </div>
      </main>
    </MainLayout>
  )
}
