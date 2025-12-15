import { useState } from "react";
import { useOutsideClick } from "@/hooks/index";
import { ChevronDown,  Minus, Plus, X } from "lucide-react";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SidebarProps) {
    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
    const [shopExpanded, setShopExpanded] = useState(false)
    const { user, logout } = useAuth()
    const [accountExpanded, setAccountExpanded] = useState(false)





    const toggleMenu = () => {
    setShopExpanded(prev => !prev);
    };


    return (
    <div
      className={`fixed top-0 h-full left-0 z-50 w-90 bg-secondary text-black shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-secondary h-screen p-10 border-r border-r-shop_light_green flex flex-col gap-6"
      >
        <div className="flex items-center justify-between gap-5 border-b border-gray-700">
            <Logo />
          <button
            onClick={onClose}
            className="hover:text-shop_light_green hoverEffect"
          >
            <X  className="w-5 h-5 hover:text-accent"/>
          </button>
        </div>

        
        
        <div className="flex-1 overflow-y-auto ">
            <nav className="p-4">
                <div className="border-b border-gray-800">
                    <Link href="/" className="block py-3 font-medium text-black hover:text-accent transition-colors">
                    Home
                </Link>
                </div>
                {/* Shop */}
                <div className="border-b border-gray-800">
                    <Link href="/shop" className="block py-3 font-medium text-black hover:text-accent transition-colors">
                      Shop
                    </Link>
                </div>
                {/* Service */}
                <div className="border-b border-gray-800">
                    <Link href="/service" className="block py-3 font-medium text-black hover:text-accent transition-colors">
                    Service
                    </Link>
                </div>
                {/* About Us */}
                <div className="border-b border-gray-800">
                    <a href="/about" className="block py-3 font-medium text-black hover:text-accent transition-colors">
                      About Us
                    </a>
                </div>
                
                {/* Contact */}
                <div className="border-b border-gray-800">
                    <Link href="/contact" className="block py-3 font-medium text-black hover:text-accent transition-colors">
                      Contact
                    </Link>
                </div>
                {/* Authentication Links */}
              <div className="border-b border-white/20">
                  <button
                    onClick={() => setAccountExpanded(!accountExpanded)}
                    className="w-full flex items-center justify-between py-4 text-lg font-medium hover:opacity-70 transition-opacity"
                  >
                    Account
                    <ChevronDown className={`h-5 w-5 transition-transform ${accountExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {accountExpanded && (
                    <div className="pb-4 pl-4 space-y-3">
                      {user ? (
                        <>
                          <div className="py-2 text-sm">
                            <p className="font-medium">{user.firstname} {user.lastname}</p>
                            <p className="text-gray-500">{user.email}</p>
                          </div>
                          
                          {/* Show My Account only for non-admin users */}
                          {user.role === "user" && (
                            <>
                              <Link
                                href="/account"
                                onClick={onClose}
                                className="block py-2 text-base hover:opacity-70 transition-opacity"
                              >
                                My Account
                              </Link>

                              <Link
                                href="/account/settings"
                                onClick={onClose}
                                className="block py-2 text-base hover:opacity-70 transition-opacity"
                              >
                                Settings
                              </Link>
                            </>
                          )}

                          {/* Admin quick links -- visible only to admins */}
                          {user.role === "admin" && (
                            <>
                              <Link
                                href="/admin"
                                onClick={onClose}
                                className="block py-2 text-base hover:opacity-70 transition-opacity"
                              >
                                Dashboards
                              </Link>
                              <Link
                                href="/admin/products"
                                onClick={onClose}
                                className="block py-2 text-base hover:opacity-70 transition-opacity"
                              >
                                Products
                              </Link>
                              <Link
                                href="/admin/orders"
                                onClick={onClose}
                                className="block py-2 text-base hover:opacity-70 transition-opacity"
                              >
                                Orders
                              </Link>
                              <Link
                                href="/admin/messages"
                                onClick={onClose}
                                className="block py-2 text-base hover:opacity-70 transition-opacity"
                              >
                                Messages
                              </Link>
                            </>
                          )}

                          <button
                            onClick={() => {
                              logout()
                              onClose()
                            }}
                            className="block py-2 text-base hover:opacity-70 transition-opacity text-left"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <Link
                          href="/login"
                          onClick={onClose}
                          className="block py-2 text-base hover:opacity-70 transition-opacity"
                        >
                          Login / Register
                        </Link>
                      )}
                </div>
               )}
            </div>

            </nav>

            
            {/*Social Media Links */}
            <div className="p-4 border-t border-gray-700">
              <SocialMedia />
            </div>  
        </div>

              
        
      </div>
    </div>
  );
}

