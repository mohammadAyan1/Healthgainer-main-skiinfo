"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Aarush Bhola",
    role: "Fitness Influencer",
    image: "https://cdn.pixabay.com/photo/2016/12/02/08/30/man-1877208_640.jpg",
    review: "BigMuscles Karnage delivers explosive energy, intense focus, unmatched pumps...",
    videoUrl: "https://player.vimeo.com/video/1094277637?h=8949da3ad7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
  {
    name: "Mannu Chaudhary",
    role: "Power Lifter",
    image: "https://images.unsplash.com/photo-1545346315-f4c47e3e1b55?w=500&auto=format&fit=crop&q=60",
    review: "For peak performance, Karnage is my go-to weapon. Make it happen with Karnage.",
    videoUrl: "https://player.vimeo.com/video/1094277637?h=8949da3ad7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
  {
    name: "Sunny Sharma",
    role: "IFBB PRO",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&auto=format&fit=crop&q=60",
    review: "Power-packed protein for peak performance!",
    videoUrl: "https://player.vimeo.com/video/1094277637?h=8949da3ad7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
  {
    name: "Sangram Chougule",
    role: "Fitness Influencer",
    image: "https://mum-objectstore.e2enetworks.net/tringcoin/seo_popular_master/202410251443_QRSZzM2QwusY8Kou.webp",
    review: "BigMuscles Karnage delivers explosive energy, intense focus, unmatched pumps...",
    videoUrl: "https://player.vimeo.com/video/1094277637?h=8949da3ad7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotatedIndex, setRotatedIndex] = useState(null);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
        setIsMobile(true);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
        setIsMobile(false);
      } else {
        setSlidesToShow(4);
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const visibleTestimonials = [];
  for (let i = 0; i < slidesToShow; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  return (
    <div className="relative w-full flex flex-col items-center py-8 md:py-12 overflow-hidden">
      <div className="mb-8">
        <h2 className="text-2xl px-4 md:text-5xl font-light py-2 text-black">
          Transformation <span className="text-lime-500 font-bold">Testimonials</span>
        </h2>
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        {!isMobile && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 z-10 bg-white p-2 md:p-3 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <FaArrowLeft size={16} className="md:w-5 md:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 z-10 bg-white p-2 md:p-3 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <FaArrowRight size={16} className="md:w-5 md:h-5" />
            </button>
          </>
        )}

        {isMobile && (
          <div className="flex justify-center gap-2 mb-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === index ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        <div
          className="flex overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex w-full transition-transform duration-500 ease-in-out gap-4 md:gap-2">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${currentIndex}-${index}`}
                className={`flex-shrink-0 ${isMobile ? "w-full" : "w-1/4"}`}
              >
                <motion.div
                  className="relative w-full h-[400px] rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onMouseEnter={() => !isMobile && setRotatedIndex(index)}
                  onMouseLeave={() => !isMobile && setRotatedIndex(null)}
                  onClick={() => isMobile && setRotatedIndex(rotatedIndex === index ? null : index)}
                >
                  <motion.div
                    className="relative w-full h-full"
                    animate={{ rotateY: rotatedIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="absolute inset-0 z-10"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="absolute inset-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                      <div className="relative h-full flex flex-col justify-end p-4 md:p-6 text-white">
                        <h3 className="text-lg md:text-xl font-bold">{testimonial.name}</h3>
                        <p className="text-xs md:text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 bg-white flex items-center justify-center rounded-xl p-4 md:p-6 border border-primary"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="relative w-full h-full">
                  <iframe
  src={`${testimonial.videoUrl}?autoplay=1&muted=1&background=1&loop=1&title=0&byline=0&portrait=0`}
  className="absolute top-0 left-0 w-full h-full rounded-xl"
  frameBorder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowFullScreen
  title={`Video of ${testimonial.name}`}
/>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {isMobile && (
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={prevSlide}
              className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <FaArrowLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <FaArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
