"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FullScreenVideo = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const videoClasses = `absolute top-0 left-0 md:w-full md:h-full ${
    isMobile ? "object-center" : "object-cover"
  }`;

  return (
    <motion.div
      className="w-full h-[30vh] md:h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <video
        className={videoClasses}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
      >
        <source src="/hg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
};

export default FullScreenVideo;
