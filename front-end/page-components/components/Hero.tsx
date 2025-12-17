"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { slides } from "@/lib/slide"
import { Button } from "@/components/ui/button"



export  default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 2000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
          >
            {/* Background Color */}
            <div className={`absolute inset-0 ${slide.bgColor}`} />

            {/* Content Container - Split Layout */}
            <div className="relative h-full container mx-auto px-4">
              <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
                {/* Left Side - Text Content */}
                <div className="flex flex-col justify-center space-y-4 md:space-y-6 md:pr-12 pt-8 md:pt-0">
                  <h1
                    className={`font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground transition-all duration-1200 delay-[400ms] ${
                      index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className={`text-sm sm:text-base md:text-lg text-foreground/70 max-w-lg transition-all duration-1200 delay-[800ms] ${
                      index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    {slide.description}
                  </p>
                  <div
                    className={`transition-all duration-1200 delay-[1200ms] ${
                      index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  >
                    <Link href={slide.link}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-foreground bg-white/5 hover:bg-[#9E8152] hover:text-white font-semibold px-6 md:px-8 py-4 md:py-6 text-sm tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        {slide.cta}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Side - Product Image */}
                <div
                  className={`flex items-center justify-center transition-all duration-1500 delay-[600ms] ${
                  index === currentSlide ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-3"
                  }`}
                >
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto object-contain drop-shadow-2xl"
                />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side Navigation - Vertical Dots and Arrows */}
      <div className="absolute right-4 md:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3 md:gap-4">
        {/* Up Arrow */}
        <button
          onClick={prevSlide}
          className="text-foreground/60 hover:text-foreground transition-colors p-1 md:p-2"
          aria-label="Previous slide"
        >
          <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Dots Indicator - Vertical */}
        <div className="flex flex-col gap-2 md:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                index === currentSlide ? "w-2.5 h-2.5 md:w-3 md:h-3 bg-foreground" : "w-2 h-2 bg-foreground/40 hover:bg-accent"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Down Arrow */}
        <button
          onClick={nextSlide}
          className="text-foreground/60 hover:text-foreground transition-colors p-1 md:p-2"
          aria-label="Next slide"
        >
          <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </section>
  )
}
