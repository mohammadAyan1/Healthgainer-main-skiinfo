'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const videos = [
  "https://www.youtube.com/embed/gRA0UKfNcRM?si=AMtxJqZHIDn-yYsq_",
  "https://www.youtube.com/embed/gRA0UKfNcRM?si=ztE81_3qMDZswmMg",
  "https://www.youtube.com/embed/iWng37p61Gs?si=l2OnRTuDdKup0sDD",
  "https://www.youtube.com/embed/nVWhj_RYcfs?si=G0bMGIPiR_m04uWY",
  "https://www.youtube.com/embed/gRA0UKfNcRM?si=-oSg-GGCmqLC9VN6",
];

const VideoSlider = () => {
  return (
    <div className=" py-8">
        <h4 className='text-center text-2xl font-bold text-primary'>Testimonials</h4>
      <h2 className="text-center text-3xl font-bold text-black mb-6">
      What Our Customers Say About 
      </h2>
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
          }}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          navigation={true}
          className="custom-swiper"
        >
          {videos.map((video, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-56 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src={video}
                  title={`Video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default VideoSlider;
