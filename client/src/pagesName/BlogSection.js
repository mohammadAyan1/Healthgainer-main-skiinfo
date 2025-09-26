"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

const blogData = [
  {
    id: 1,
    image: "https://cdn.pixabay.com/photo/2019/11/07/05/07/exercise-4607682_1280.jpg",
    category: "TOP 10 EASY BACK EXERCISES",
    title: "Top 10 Easy Back Exercises for Gym",
    date: "JANUARY 09, 2025",
    description: "Most people around the globe start the day with a myriad of issues, but back pain tends to be one...",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1521986329282-0436c1f1e212?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "TOP 10 VITAMIN C RICH FOODS",
    title: "Top 10 Vitamin C Rich Foods.",
    date: "DECEMBER 27, 2024",
    description: "Vitamin C, also referred to as ascorbic acid, is a nutrient that is essential to health. It has been...",
  },
  {
    id: 3,
    image: "https://plus.unsplash.com/premium_photo-1663852297555-e2c68137106b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhbHRoeSUyMGZvb2R8ZW58MHwwfDB8fHww",
    category: "7-DAY WEIGHT LOSS DIET PLAN FOR WOMEN",
    title: "7-Day Weight Loss Diet Plan for Women",
    date: "DECEMBER 24, 2024",
    description: "Achieving and maintaining a healthy weight is more than just the number on the scale—it involve...",
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function BlogSection() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex(prev => (prev + 1) % blogData.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex(prev => prev === 0 ? blogData.length - 1 : prev - 1);
  }, []);

  const goToSlide = useCallback((i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  }, [index]);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleReadMore = useCallback(() => {
    router.push(`/blog/${blogData[index].id}`);
  }, [index, router]);

  return (
    <section 
      className="py-12 px-6 md:px-12 lg:px-24"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Blogs</h2>
      
      <div className="relative overflow-hidden h-[500px] md:h-[450px]">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              type: "tween",
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 right-0 flex flex-col md:flex-row gap-6"
          >
            {blogData.map((blog, i) => (
              <div
                key={blog.id}
                className={`w-full md:w-1/3 bg-white rounded-lg shadow-lg p-4 ${
                  i === index ? "block" : "hidden md:block"
                }`}
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-lg"
                  loading={i === index ? "eager" : "lazy"}
                />
                <div className="mt-4">
                  <h3 className="text-lg font-bold mt-2">{blog.title}</h3>
                  <p className="text-gray-500 text-sm my-2">{blog.date}</p>
                  <p className="text-gray-600 text-sm">{blog.description}</p>
                  <button 
                    onClick={handleReadMore}
                    className="mt-4 px-2 py-1 border border-primary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 z-10"
          aria-label="Previous slide"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 z-10"
          aria-label="Next slide"
        >
          <FaArrowRight className="text-gray-700" />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {blogData.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-primary w-6" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}