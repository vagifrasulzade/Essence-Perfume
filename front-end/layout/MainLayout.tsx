"use client";

import Footer from "./Footer";
import Header from "./Header";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <Header />
          
            <main>
                {children}
            </main>

            <Footer />
          
        </>
    );
}