'use client';
import React from 'react';
import CountUp from 'react-countup';
import "swiper/css";
import "swiper/css/pagination";

const newsLogos = [
  {
    src: "/News/All new in one.jpg",
    alt: "Afaqs",
    featuredText: "Featured in The Week",
  },
];

const stats = [
  {
    icon: "icons/pngegg (63).png",
    end: 10,
    duration: 2,
    label: "Years Of Experience",
  },
  {
    icon: "icons/Star2.png",
    end: 800,
    duration: 2,
    label: "5 Star Rating On Amazon",
  },
  {
    icon: "icons/pngegg (65).png",
    end: 500000,
    duration: 3,
    label: "Satisfied Consumers",
    separator: ",",
  },
  {
    icon: "icons/pngegg (66).png",
    end: 100,
    duration: 2,
    label: "Associates",
  },
];

export default function AyurvedicWeightGainer() {
  return (
    <section className="bg-white border border-gray-300 shadow-lg overflow-hidden">

      <div className="bg-[#6d8445] text-white text-center py-2 px-4 mt-2">
        <h2 className="text-xl md:text-4xl font-bold tracking-wide">
          INDIA’S BEST AYURVEDIC WEIGHT GAINER AS PER MEDIA GIANTS
        </h2>
      </div>

      <div className="w-full overflow-hidden bg-white">
        <div className="flex animate-marqueeMobile md:animate-marquee whitespace-nowrap">
          {newsLogos.concat(newsLogos).map((logo, index) => (
            <div
              key={index}
              className="mx-6 flex-shrink-0 h-20 w-[400vw] md:w-[100vw] flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="object-contain w-full h-full"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 text-center px-6 py-5 gap-8 bg-white">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center">
              <img
                src={stat.icon}
                alt={stat.label}
                className="w-16 sm:w-16 p-2"
                loading="lazy"
              />
            </div>
            <p className="text-2xl md:text-4xl font-bold text-gray-900">
              <CountUp end={stat.end} duration={stat.duration} separator={stat.separator || ''} />+
            </p>
            <p className="text-lg md:text-2xl font-medium text-center">{stat.label}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
