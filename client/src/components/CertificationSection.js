'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

const certifications = [
  {
    src: "/certificate/ayush-logos.png",
    alt: "AYUSH",
    title: "Ministry of AYUSH",
    description: "AYUSH certified (Ayurveda, Unani, Siddha, Homeopathy)"
  },
  {
    src: "/certificate/FSSAI_logos.png",
    alt: "FSSAI",
    title: "FSSAI Certified",
    description: "Food Safety and Standards Authority of India"
  },
  {
    src: "/certificate/gmp-logos.png",
    alt: "GMP",
    title: "GMP Certified",
    description: "Good Manufacturing Practice Unit"
  },
  {
    src: "/certificate/iso-logos.png",
    alt: "ISO",
    title: "ISO Certified",
    description: "ISO 9001:2015 & 22000:2015 Standards"
  }
];

const CertificationCard = ({ cert }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-[120px] h-[120px] relative mb-3">
      <Image
        src={cert.src}
        alt={cert.alt}
        fill
        style={{ objectFit: 'contain' }}
        loading="lazy"
      />
    </div>
    <p className="font-semibold text-lg">{cert.title}</p>
    <p className="text-sm mt-1 text-gray-600">{cert.description}</p>
  </div>
);

const CertificationSection = () => {
  const swiperConfig = useMemo(() => ({
    modules: [Autoplay, Pagination],
    autoplay: { delay: 3000, disableOnInteraction: false },
    loop: true,
    pagination: { clickable: true, el: '.custom-swiper-pagination' },
    spaceBetween: 30,
    breakpoints: {
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    }
  }), []);

  const slides = useMemo(() => 
    certifications.map((cert, index) => (
      <SwiperSlide key={index}>
        <CertificationCard cert={cert} />
      </SwiperSlide>
    ))
  , []);

  return (
    <section className="bg-[#f2f3ee] py-12 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Safe, Tested & Certified</h2>
      <p className="text-lg md:text-xl mb-10">Our certifications are the standard of trust and quality assurance.</p>

      <div className="relative max-w-7xl mx-auto">
        <Swiper {...swiperConfig}>
          {slides}
        </Swiper>

        <div className="custom-swiper-pagination mt-6 flex justify-center gap-2" />
      </div>
    </section>
  );
};

export default CertificationSection;