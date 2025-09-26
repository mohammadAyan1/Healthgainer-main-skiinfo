'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function YoutubeSection() {
  return (
    <section
      className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 flex flex-col md:flex-row items-center bg-cover bg-center overflow-x-auto"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/flat-lay-minimal-medicinal-pills-assortment_23-2148892352.jpg?w=1060')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] opacity-85"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">

        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full max-w-lg">
            <iframe
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-lg shadow-xl"
              src="https://www.youtube.com/embed/iWng37p61Gs?si=bXy-QMF68v9sGI4O"
              title="Supplement Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 mt-6 md:mt-0 text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-wide">
            How Our Supplement Works
          </h2>
          <div className="w-24 h-1 bg-[#FFD700] mx-auto md:mx-0 my-4"></div>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Our scientifically formulated supplement fuels your body with the highest quality nutrients to help you reach your fitness goals.
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
            Packed with essential vitamins, minerals, and proteins, it ensures muscle recovery, strength, and sustained energy throughout the day.
          </p>

          <motion.button
            className="mt-6 px-6 py-3 rounded-lg text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff8c00] to-[#ff4500] hover:from-[#ff4500] hover:to-[#ff8c00] transform hover:scale-105 transition-all duration-300 ease-in-out"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            DISCOVER MORE
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}