import { Card, CardContent } from "@/components/ui/card"
import { Truck, Package, Globe, Clock } from "lucide-react"

export default function Shipping() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
          <p className="text-muted-foreground">
            Everything you need to know about our shipping policies and delivery options
          </p>
        </div>

        <div className="space-y-8">
          {/* Shipping Methods */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">Shipping Methods</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Standard Shipping (5-7 Business Days)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our most economical shipping option. Perfect for non-urgent orders.
                  </p>
                  <p className="text-sm font-medium">Free on orders over $75</p>
                  <p className="text-sm text-muted-foreground">$5.99 for orders under $75</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-2">Express Shipping (2-3 Business Days)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Faster delivery for when you need your fragrance sooner.
                  </p>
                  <p className="text-sm font-medium">$12.99 flat rate</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-2">Overnight Shipping (1 Business Day)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Next-day delivery for urgent orders. Order by 2 PM EST for next-day delivery.
                  </p>
                  <p className="text-sm font-medium">$24.99 flat rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Shipping */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">International Shipping</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We ship to over 100 countries worldwide. International shipping rates and delivery times vary by
                  destination.
                </p>
                <div className="bg-secondary rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Important Notes:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Customs duties and taxes may apply and are the responsibility of the recipient</li>
                    <li>Delivery times are estimates and may vary due to customs processing</li>
                    <li>Some countries have restrictions on perfume shipments</li>
                    <li>International orders cannot be expedited</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Time */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">Processing Time</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or
                  holidays.
                </p>
                <p className="text-sm text-muted-foreground">
                  If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow
                  additional days in transit for delivery.
                </p>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm font-medium">
                    You will receive a shipping confirmation email with tracking information once your order has
                    shipped.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Packaging */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">Packaging & Care</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All perfumes are carefully packaged to ensure they arrive in perfect condition. We use protective
                  materials and secure packaging to prevent damage during transit.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-sm">Secure Packaging</h3>
                    <p className="text-xs text-muted-foreground">
                      Bubble wrap and protective inserts keep your fragrances safe
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-sm">Discreet Shipping</h3>
                    <p className="text-xs text-muted-foreground">Plain packaging with no indication of contents</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-6 bg-secondary">
              <p className="text-sm text-muted-foreground text-center">
                Have questions about shipping?{" "}
                <a href="/contact" className="text-accent hover:underline font-medium">
                  Contact our customer service team
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
