"use client";

import { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form...",
    name: "Johnson Williams",
    role: "CEO, Creative Idea",
    image: "https://themebuz.com/html/vigo/demo/vigo-green/img/author-img-1.png", // Replace with actual image
  },
  {
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries...",
    name: "Emily Carter",
    role: "Marketing Head, XYZ",
    image: "https://themebuz.com/html/vigo/demo/vigo-green/img/author-img-1.png",
  },
  {
    text: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in classical Latin literature from...",
    name: "Michael Smith",
    role: "Co-Founder, ABC Corp",
    image: "https://themebuz.com/html/vigo/demo/vigo-green/img/author-img-1.png",
  },
];

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="relative bg-cover bg-center py-20 px-6 text-center text-white"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "top" }} // Replace with actual background
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <FaQuoteLeft className="text-5xl text-green-400 mx-auto" />

        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg mt-4"
        >
          {testimonials[index].text}
        </motion.p>

        <motion.div
          key={index + "-profile"}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex flex-col items-center"
        >
          <img
            src={testimonials[index].image}
            alt={testimonials[index].name}
            className="w-14 h-14 rounded-full border-2 border-green-400"
          />
          <h3 className="text-xl font-semibold mt-2">{testimonials[index].name}</h3>
          <p className="text-green-400 text-sm">{testimonials[index].role}</p>
        </motion.div>

        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === i ? "bg-green-400 w-6" : "bg-gray-500"
              }`}
              onClick={() => setIndex(i)}
            ></button>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-green-500 transition"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-green-500 transition"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default TestimonialSlider;
