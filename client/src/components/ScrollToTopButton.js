"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = useCallback(() => {
    setIsVisible(window.scrollY > 200);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toggleVisibility]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isVisible && (
        <motion.button
          className="p-4 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition focus:outline-none"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <FaArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}