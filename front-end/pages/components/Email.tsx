"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Contact() {

    return(

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Join Our Fragrance Community</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to receive exclusive offers, fragrance tips, and early access to new collections
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email"
              className="bg-white  " />
              <Button type="submit" 
              className="bg-accent text-white hover:bg-accent/80 font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
    );
}