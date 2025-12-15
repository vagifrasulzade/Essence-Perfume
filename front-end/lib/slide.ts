export interface Slide {
    id: number;
    image: string;
    title: string;
    description: string;
    cta: string;
    link: string;
    bgColor: string;
    height?: string;
}

export const slides: Slide[] = [
    {
        id: 1,
        image: "/assets/slide/slide.png",
        title: "20% Sell Off",
        description:
            "Indulge in our exclusive collection of premium perfumes. Elevate your scent game with timeless elegance.",
        cta: "SHOP NOW",
        link: "/shop",
        bgColor: "bg-[#CFB58C]",
    },
    {
        id: 2,
        image: "/assets/slide/slide2.png",
        title: "New Arrivals",
        description: "Discover the latest fragrances from world-renowned perfume houses. Experience luxury in every drop.",
        cta: "SHOP NOW",
        link: "/shop?sort=newest",
        bgColor: "bg-[#CFB58C]",
    },
    {
        id: 3,
        image: "/assets/slide/slide3.png",
        title: "Exclusive Collections",
        description: "Limited edition fragrances that define elegance and sophistication. Elevate your signature scent.",
        cta: "SHOP NOW",
        link: "/shop?featured=true",
        bgColor: "bg-[#CFB58C]",
    },
]