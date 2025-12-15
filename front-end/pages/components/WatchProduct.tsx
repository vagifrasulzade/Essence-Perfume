"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function WatchShopPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center">
        WATCH & SHOP
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: Video Card */}
        <div className="card-medium">
          <div className="relative h-80 md:h-[360px] overflow-hidden rounded-xl">
            <Image
              src="/assets/watch-shop/dior-homme-walpaper.jpg"
              alt="Campaign hero"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <button
              onClick={() => setShowVideo(true)}
              aria-label="Play campaign video"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

          {showVideo && (
            <div
              className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4"
              onClick={() => setShowVideo(false)}
            >
              <div
                className="relative w-full max-w-3xl aspect-video overflow-hidden rounded-2xl bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src="https://www.youtube.com/embed/gZxQaZn7tv0?autoplay=1"
                  title="Promo Video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="h-full w-full"
                />
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Card (single bigger image) */}
        <div className="card-medium">
          <div className="flex flex-col items-center text-center">
            <div className="relative mx-auto mb-5 h-50 w-50 md:h-50 md:w-50">
              <Image
                src="/assets/watch-shop/perfume.png"
                alt="Dior Homme Eau de Parfum"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 40vw, 24vw"
              />
            </div>

            <h3 className="mb-3 text-xl font-semibold tracking-tight md:text-2xl">
              Dior Homme Eau de Parfum
            </h3>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-neutral-700">
              Experience the refined elegance of Dior Homme Eau de Parfum, a sophisticated fragrance
              that blends woody and floral notes for the modern man.
            </p>

            <Link href="/shop">
              <Button variant="outline" size="lg" className=" hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


