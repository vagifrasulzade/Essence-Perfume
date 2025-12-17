import { testimonials } from "@/lib/testimonials";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function Testimonials() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval); 
    }, []);
    const goToSlide = (index: number) => {
        setCurrentTestimonial(index);
    };


    return(
        <section className="py-20" style={{ backgroundImage: "url('/assets/testimonials/background.jpg')" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Profile Picture */}
                <div className="flex justify-center mb-8">
                    <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                     className="w-24 h-24 rounded-full object-cover shadow-lg"
                    />
                </div>
                {/* Testimonial Text */}
                <div className="mb-8">
                    <p className="text-lg italic">{testimonials[currentTestimonial].text}</p>
                </div>
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                    <Quote className="text-accent" size={48} strokeWidth={1.5} />
                </div>
                {/* Author Name */}
                <div className="text-sm font-bold text-gray-800 tracking-wider mb-8">
                    {testimonials[currentTestimonial].name}
                </div>


                {/* Star Rating */}
                <div className="flex justify-center gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                    ))}
                </div>




                {/* Navigation Dots */}
                <div className="flex justify-center gap-3">
                    {testimonials.map((_, index) => (
                        <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                        ? "bg-accent hover:bg-accent"
                        : "bg-foreground hover:bg-foreground/50"
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                    ))}
                </div>
            </div>
        </section>
    );
    

}