"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const featureSets = [
  [
    { title: "High Protein Content" },
    { title: "Fast Absorption Formula" },
    { title: "100% Organic Ingredients" },
  ],
  [
    { title: "Clinically Tested Formula" },
    { title: "No Artificial Additives" },
    { title: "Supports Muscle Recovery" },
  ],
  [
    { title: "Enhanced Strength Boost" },
    { title: "No Side Effects" },
    { title: "Gluten-Free & Vegan" },
  ],
];

export default function SupplementFeature() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featureSets.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featureSets.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="relative py-16 bg-gradient-to-b from-blue-100 via-white to-blue-100 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
      <div className="container mx-auto text-center relative">
        <h2 className="text-primary italic text-lg tracking-wide">Our</h2>
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Supplement Features</h1>
        <div className="border-t-4 border-primary w-16 mx-auto mb-10"></div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-16">
        <div className="flex flex-col gap-6">
          {featureSets[currentIndex].slice(0, 3).map((feature, idx) => (
            <FeatureCard key={idx} title={feature.title} />
          ))}
        </div>
        <div className="relative flex-shrink-0">
          <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-r from-primary to-black rounded-full flex items-center justify-center shadow-2xl">
            <Image
              className="rounded-xl drop-shadow-lg"
              src="/hero.png"
              width={300}
              height={300}
              alt="Whey Protein"
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {featureSets[currentIndex].slice(0, 3).map((feature, idx) => (
            <FeatureCard key={idx} title={feature.title} />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prevSlide}
          className="p-3 bg-white shadow-lg rounded-full hover:scale-110 transition-all"
        >
          <FaArrowLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 bg-white shadow-lg rounded-full hover:scale-110 transition-all"
        >
          <FaArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}

const FeatureCard = ({ title }) => {
  return (
    <div className="flex items-center bg-white/80 backdrop-blur-lg text-gray-900 shadow-lg border border-gray-200 rounded-lg p-5 max-w-md transition-transform hover:scale-105">
      <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full mr-5 shadow-md">
        <Image src="/2.png" width={40} height={40} alt="Feature Icon" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">
          Experience the best supplement benefits designed for ultimate performance.
        </p>
      </div>
    </div>
  );
};
