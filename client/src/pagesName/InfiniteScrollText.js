"use client";

import { motion } from "framer-motion";

const InfiniteScrollLine = () => (
  <div className="relative w-full h-[5px] bg-white overflow-hidden">
    <motion.div
      className="absolute h-[5px] bg-primary rounded-full"
      animate={{
        x: ["-100%", "100%"],
        width: ["0%", "50%", "100%", "50%", "0%"],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 6,
        ease: "linear",
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    />
  </div>
);

export default InfiniteScrollLine;
