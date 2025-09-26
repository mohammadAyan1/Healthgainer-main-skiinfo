"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");

  const generateMessage = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user
        ? `Hello, my name is ${user.firstName} ${user.lastName}. I am interested in your services. Can you please provide more details?`
        : "Hello! I need some assistance regarding your services.";
    } catch {
      return "Hello! I need some assistance regarding your services.";
    }
  }, []);

  useEffect(() => {
    const message = generateMessage();
    setWhatsappLink(`https://wa.me/9522660777?text=${encodeURIComponent(message)}`);
  }, [generateMessage]);

  const handleMouseEnter = useCallback(() => setShowTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTooltip(false), []);
  const tooltipContent = useMemo(() => (
    <motion.div
      className="absolute bottom-12 bg-gray-800 text-white text-sm md:px-4 md:py-2 rounded-md shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      Chat with us on WhatsApp!
    </motion.div>
  ), []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showTooltip && tooltipContent}

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp className="w-6 h-6 md:w-8 md:h-8" />
        </a>
      </div>
    </div>
  );
}