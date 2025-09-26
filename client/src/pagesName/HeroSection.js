"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllImages } from "@/redux/slices/header-slice/imageSlice";

function Slider({ slides }) {
  const scrollContainerRef = useRef(null);
  const scrollIndex = useRef(0);
  const totalSlides = slides.length;

  const scrollToIndex = useCallback(
    (index) => {
      if (scrollContainerRef.current) {
        scrollIndex.current = (index + totalSlides) % totalSlides;
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.clientWidth * scrollIndex.current,
          behavior: "smooth",
        });
      }
    },
    [totalSlides]
  );

  const scrollNext = useCallback(() => {
    scrollToIndex(scrollIndex.current + 1);
  }, [scrollToIndex]);

  const scrollPrev = useCallback(() => {
    scrollToIndex(scrollIndex.current - 1);
  }, [scrollToIndex]);

  useEffect(() => {
    if (totalSlides === 0) return;
    const interval = setInterval(scrollNext, 10000);
    return () => clearInterval(interval);
  }, [totalSlides, scrollNext]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {slides.map((slide, index) => (
          <section
            key={index}
            className="flex-shrink-0 w-screen flex items-center justify-center bg-black"
          >
            <motion.img
              key={slide.image}
              src={slide.image}
              alt={`Slide ${index + 1}`}
              loading="lazy" 
              className="w-screen object-contain rounded-xl shadow-xl"
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </section>
        ))}
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full z-20 hover:bg-white transition"
      >
        <ChevronLeft className="w-5 h-5 text-black" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full z-20 hover:bg-white transition"
      >
        <ChevronRight className="w-5 h-5 text-black" />
      </button>
    </div>
  );
}

export default function HeroSection() {
  const { images } = useSelector((state) => state?.headerSlider || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllImages());
  }, [dispatch]);

  const formatSlides = (type) =>
    images
      ?.filter((img) => img.type === type)
      ?.sort((a, b) => a.sno - b.sno)
      ?.map((img) => ({ image: img.url })) || [];

  const desktopSlides = formatSlides("desktop");
  const mobileSlides = formatSlides("mobile");

  return (
    <>
      {desktopSlides.length > 0 && (
        <div className="hidden md:block">
          <Slider slides={desktopSlides} />
        </div>
      )}
      {mobileSlides.length > 0 && (
        <div className="block md:hidden">
          <Slider slides={mobileSlides} />
        </div>
      )}
    </>
  );
}