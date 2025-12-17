import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-linear-to-br from-[#d5aa65] to-[#c5ad87] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">About Essence</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crafting timeless fragrances that capture the essence of elegance and sophistication
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded in 2010, Essence began with a simple vision: to create perfumes that tell stories and evoke
                emotions. Our journey started in a small atelier in Paris, where our master perfumer spent years
                perfecting the art of fragrance composition.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Today, we are proud to offer a curated collection of luxury fragrances that blend traditional
                craftsmanship with modern innovation. Each bottle represents our commitment to quality, elegance, and
                the timeless art of perfumery.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From sourcing the finest ingredients to the final packaging, every step of our process is guided by
                passion and attention to detail. We believe that a great fragrance is more than just a scent—it's an
                experience, a memory, and a part of your identity.
              </p>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image src="/assets/about/luxury-perfume-atelier-workspace-with-bottles-and-.jpg" alt="Perfume atelier workspace" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Quality Excellence</h3>
              <p className="text-muted-foreground leading-relaxed">
                We source only the finest ingredients from around the world, ensuring each fragrance meets our exacting
                standards of quality and longevity.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Sustainability</h3>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to sustainable practices, from eco-friendly packaging to supporting ethical sourcing of
                natural ingredients.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Artisan Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every fragrance is crafted by hand with meticulous attention to detail, honoring centuries-old perfumery
                traditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">Meet Our Master Perfumers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src="/assets/about/elegant-female-master-perfumer-portrait-profession.jpg" alt="Master Perfumer" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">Sophie Laurent</h3>
              <p className="text-sm text-muted-foreground mb-2">Master Perfumer</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                With over 20 years of experience, Sophie brings her expertise in floral and oriental compositions.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src="/assets/about/male-perfumer-expert-professional-portrait.jpg" alt="Perfumer" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">Marco Rossi</h3>
              <p className="text-sm text-muted-foreground mb-2">Senior Perfumer</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Marco specializes in woody and fresh fragrances, creating modern scents with timeless appeal.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src="/assets/about/asian-fragrance-expert-creative-director-portrait.jpg" alt="Fragrance Expert" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">Yuki Tanaka</h3>
              <p className="text-sm text-muted-foreground mb-2">Creative Director</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yuki leads our creative vision, blending Eastern and Western perfumery traditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br  from-[#d5aa65] to-[#c5ad87]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Experience Our Collection</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover fragrances that tell your story. Each bottle is a journey waiting to unfold.
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="border-2 border-foreground bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105"
            >
              Explore Our Fragrances
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
