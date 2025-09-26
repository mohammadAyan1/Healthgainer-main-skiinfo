"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "@/redux/slices/video-carousel-slice/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const toEmbed = (url = "") => {
  const patterns = [
    { regex: /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/i, provider: "youtube" },
    { regex: /youtube\.com\/watch\?v=([^&]+)/i, provider: "youtube" },
    { regex: /youtu\.be\/([a-zA-Z0-9_-]{6,})/i, provider: "youtube" },
    { regex: /vimeo\.com\/(?:video\/)?(\d+)/i, provider: "vimeo" },
  ];

  for (let { regex, provider } of patterns) {
    const match = url.match(regex);
    if (match?.[1]) {
      const id = match[1];
      return {
        provider,
        id,
        src:
          provider === "youtube"
            ? `https://www.youtube.com/embed/${id}?controls=1&modestbranding=1&rel=0&playsinline=1`
            : `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`,
      };
    }
  }

  return { provider: "unknown", id: null, src: url };
};

const ArrowButton = React.memo(({ direction, onClick, disabled }) => (
  <button
    aria-label={direction === "prev" ? "Previous video" : "Next video"}
    onClick={onClick}
    disabled={disabled}
    className={`md:flex absolute ${
      direction === "prev" ? "left-[-15px]" : "right-[-15px]"
    } top-1/2 z-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {direction === "prev" ? (
      <FaArrowLeft className="w-4 h-4" />
    ) : (
      <FaArrowRight className="w-4 h-4" />
    )}
  </button>
));

ArrowButton.displayName = 'ArrowButton';

export default function Testimonials() {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const handlePrev = useCallback(() => {
    if (swiperRef.current && !swiperRef.current.isBeginning) {
      swiperRef.current.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (swiperRef.current && !swiperRef.current.isEnd) {
      swiperRef.current.slideNext();
    }
  }, []);

  const onSwiper = useCallback((swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const onSlideChange = useCallback((swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full flex flex-col items-center py-6 md:py-12 ">
        <h2 className="text-2xl md:text-3xl font-light text-black mb-4 text-center">
          Real Transformation <span className="text-lime-500 font-bold">Testimonials</span>
        </h2>
        <p className="text-gray-500">No videos available</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center py-6 md:py-12 px-4 relative">
      <h2 className="text-2xl md:text-3xl font-light text-black mb-6 text-center">
        Real Transformation <span className="text-lime-500 font-bold">Testimonials</span>
      </h2>

      <div className="relative w-full max-w-8xl mx-auto">
        <ArrowButton 
          direction="prev" 
          onClick={handlePrev} 
          disabled={isBeginning}
        />
        <ArrowButton 
          direction="next" 
          onClick={handleNext} 
          disabled={isEnd}
        />

        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={16}
          loop={videos.length > 1}
          pagination={{ 
            el: ".custom-swiper-pagination", 
            clickable: true,
            dynamicBullets: true
          }}
          onSwiper={onSwiper}
          onSlideChange={onSlideChange}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: videos.length >= 5 ? 4 : videos.length, spaceBetween: 20 },
          }}
          className="px-2"
        >
          {videos.map((video, index) => {
            const { src } = toEmbed(video.videoUrl);
            return (
              <SwiperSlide key={video._id || index}>
                <div className="w-full h-[300px] md:h-[350px] rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={src}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Testimonial from ${video.name || `Customer ${index + 1}`}`}
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="custom-swiper-pagination mt-4 flex justify-center gap-1" />
      </div>
    </div>
  );
}