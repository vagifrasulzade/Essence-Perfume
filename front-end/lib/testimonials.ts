export interface Testimonial {
    id: number;
    name: string;
    image: string;
    text: string;
}
export const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Emily Roberts",
        image: "/assets/testimonials/woman.jpg",
        text: "I absolutely love this perfume! The scent is so refreshing and lasts all day."
    },
    {
        
        id: 2,
        name: "James Kingston",
        image: "/assets/testimonials/man.jpg",
        text: "One of the best perfumes I’ve ever tried! The aroma is enchanting and truly unique."
    },
    {
        id: 3,
        name: "Sophia Lawrence",
        image: "/assets/testimonials/woman2.jpg",
        text: "This fragrance is perfect for any occasion. It’s elegant and subtle yet memorable."
        
    },
    {
        id: 4,
        name: "Michael Bennett",
        image: "/assets/testimonials/man2.jpg",
        text: "This perfume is my new favorite! It’s light, fresh, and I get compliments every time I wear it."
    }
]