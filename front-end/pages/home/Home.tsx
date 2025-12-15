"use client"

import Email from "../components/Email";
import FeaturedProducts from "../components/FeaturedProducts";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import WatchProduct from "../components/WatchProduct";

export default function Main() 
{
    return (
        <>
            <Hero />
            <FeaturedProducts/>
            <Testimonials />
            <WatchProduct />
            <Email />
        </>
    );
}
