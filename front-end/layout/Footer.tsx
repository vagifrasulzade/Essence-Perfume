"use client";
import Link from "next/link";
import Logo from "../components/Logo";
import SocialMedia from "../components/SocialMedia";
import { Home, Mail, Phone } from "lucide-react";

export default function Footer() {
    return(
    <footer className="bg-secondary mt-20">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <Logo />
                    <p className="text-sm text-muted-foreground">
                      Discover your signature scent with our curated collection of luxury perfumes.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Home />
                          <span className="ml-2">111 Nizami St, Baku, Azerbaijan</span>
                        </li>
                        <li className="flex items-center">
                          <Phone />
                          <span className="ml-2">+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center">
                          <Mail />
                          <span className="ml-2">info@essence-perfume.com</span>
                        </li>

                    </ul>
                </div>
                
                <div>
                    <h4 className="font-semibold mb-4">Customer Service</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/contact" className="hover:text-accent transition-colors">
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/track-order" className="hover:text-accent transition-colors">
                          Track Order
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="hover:text-accent transition-colors">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/shipping" className="hover:text-accent transition-colors">
                          Shipping Info
                        </Link>
                      </li>
                      <li>
                        <Link href="/returns" className="hover:text-accent transition-colors">
                          Returns
                        </Link>
                      </li>

                    </ul>
                </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <SocialMedia />
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Essence. All rights reserved.</p>
        </div>
      </div>
    </footer>
    );
}
