"use client";

import { Menu, X } from "lucide-react";
import SideMenu from "./SideMenu";
import { useState } from "react";

export default function MobileMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return(
        <div className="flex md:hidden">
            {mobileMenuOpen && (
              <SideMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            )}

         <button
              className="md:hidden hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             
          </button>

        </div>
    );
    
}