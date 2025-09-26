"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Aarush Bhola",
    role: "Fitness Influencer",
    image: "/1.png",
    review: "BigMuscles Karnage delivers explosive energy, intense focus, unmatched pumps...",
  },
  {
    name: "Mannu Chaudhary",
    role: "Power Lifter",
    image: "/2.png",
    review: "For peak performance, Karnage is my go-to weapon. Make it happen with Karnage.",
  },
  {
    name: "Sunny Sharma",
    role: "IFBB PRO",
    image: "/3.png",
    review: "Power-packed protein for peak performance!",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full flex flex-col items-center py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Real People. Real Reviews ❤</h2>

      <div className="relative w-full max-w-4xl mx-auto">
        <button 
          onClick={prevSlide} 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="flex overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ 
              transform: `translateX(-${currentIndex * (100 / testimonials.length)}%)`,
              width: `${testimonials.length * 100}%`
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4" style={{ width: `${100 / testimonials.length}%` }}>
                <motion.div
                  className="relative w-full h-[400px] bg-red-500 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  <div className="relative h-full flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-sm">{testimonial.role}</p>
                  </div>

                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-lg font-medium">{testimonial.review}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={nextSlide} 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <FaArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}