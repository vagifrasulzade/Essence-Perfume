import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, Package, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Returns() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-muted-foreground">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>

        <div className="space-y-8">
          {/* Return Policy */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <RotateCcw className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">30-Day Return Policy</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day return policy from the date of delivery. If you're not satisfied with your purchase,
                  you can return it for a full refund or exchange.
                </p>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">To be eligible for a return:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Item must be unused and in the same condition that you received it</li>
                    <li>Item must be in the original packaging with all tags attached</li>
                    <li>Perfume bottles must be unopened and sealed</li>
                    <li>Return must be initiated within 30 days of delivery</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Return */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">How to Return an Item</h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contact Us</h3>
                    <p className="text-sm text-muted-foreground">
                      Email us at returns@essence.com with your order number and reason for return. We'll send you a
                      return authorization number (RMA).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Pack Your Item</h3>
                    <p className="text-sm text-muted-foreground">
                      Securely pack the item in its original packaging. Include the RMA number and your order receipt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ship It Back</h3>
                    <p className="text-sm text-muted-foreground">
                      Ship the package to the address provided in your RMA email. We recommend using a trackable
                      shipping service.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Receive Your Refund</h3>
                    <p className="text-sm text-muted-foreground">
                      Once we receive and inspect your return, we'll process your refund within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">Exchanges</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you'd like to exchange an item for a different size, scent, or product, please follow the return
                  process above and place a new order for the item you'd like.
                </p>
                <p className="text-sm text-muted-foreground">
                  This ensures you receive your new item as quickly as possible while we process your return.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Non-Returnable Items */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-6 w-6 text-accent" />
                <h2 className="font-serif text-2xl font-bold">Non-Returnable Items</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  For health and safety reasons, the following items cannot be returned:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Opened or used perfume bottles</li>
                  <li>Items without original packaging or tags</li>
                  <li>Sale or clearance items (unless defective)</li>
                  <li>Gift cards</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Refund Information */}
          <Card>
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">Refund Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Processing Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Refunds are processed within 5-7 business days after we receive your return. You'll receive an email
                    confirmation once your refund has been processed.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Refund Method</h3>
                  <p className="text-sm text-muted-foreground">
                    Refunds will be issued to the original payment method used for the purchase.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Shipping Costs</h3>
                  <p className="text-sm text-muted-foreground">
                    Original shipping costs are non-refundable. Return shipping costs are the responsibility of the
                    customer unless the item is defective or we made an error.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Damaged or Defective Items */}
          <Card>
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">Damaged or Defective Items</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you receive a damaged or defective item, please contact us immediately at support@essence.com with
                  photos of the damage. We'll arrange for a replacement or full refund, including return shipping costs.
                </p>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm font-medium">
                    Please inspect your order upon reception and contact us immediately if the item is defective,
                    damaged, or if you receive the wrong item.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="font-serif text-xl font-bold mb-4">Need Help with a Return?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our customer service team is here to assist you with any questions about returns or exchanges.
              </p>
              <Link href="/contact">
                <Button>Contact Customer Service</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
