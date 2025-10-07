"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals } from "@/redux/slices/deal-slice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import { useSearchParams } from "next/navigation";
import { useRouteHistory } from "@/context/RouteContext";
import PlaceOrderForm from "@/components/PlaceOrderForm";

export default function DealsOfTheDay() {
  const { showPlaceOrder, setShowPlaceOrder } = useRouteHistory();

  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deals);

  const [activeIndex, setActiveIndex] = useState(null);
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const router = useRouter();

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  const handleCardClick = (index) => {
    swiperRef.current?.slideTo(index);
    setActiveIndex(index);
  };

  const hotDealIndex = deals.findIndex((deal) => deal.tag === "HOT DEAL");

  const handleViewPlanClick = (deal) => {
    console.log(deal);

    const query = new URLSearchParams({
      title: deal.title,
      amount: deal.price,
      quantity: deal.quantity,
      subtitle: deal.subtitle,
      type: "viewPlan",
      productId: deal._id,
    }).toString();

    const targetRoute = `/checkout?${query}`;
    if (user) {
      router.push(targetRoute);
    } else {
      const targetDeal = {
        title: deal.title,
        price: deal.price,
        quantity: deal.quantity,
        subtitle: deal.subtitle,
        type: "viewPlan",
        productId: deal._id,
        createdAt: deal.createdAt,
        image: deal.image,
      };

      localStorage.setItem("redirectAfterLogin", JSON.stringify(targetDeal));

      // localStorage.setItem("redirectAfterLogin", JSON.stringify(targetRoute));
      // toast.warn("Please login to continue!", {
      //   position: "top-center",
      //   autoClose: 3000,
      // });
      // router.push(`/login`);
      setShowPlaceOrder(true);
      // router.push(`/placeorder`);
    }
  };

  if (loading || !deals.length) {
    return <div className="text-center text-white py-10">Loading deals...</div>;
  }
  const sortedDeals = [...deals].sort((a, b) => a.sno - b.sno);

  return (
    <div className="bg-[#060606] py-10 px-4 md:px-20 overflow-hidden font-sans relative">
      {showPlaceOrder && <PlaceOrderForm />}
      <div className="mb-6 text-center">
        <h2 className="text-4xl px-4 md:text-5xl font-light py-2 text-white">
          Deal of the <span className="text-lime-500 font-bold">Day</span>
        </h2>
      </div>

      <button
        ref={prevRef}
        className="flex absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <FaArrowLeft className="text-black w-5 h-5" />
      </button>

      <button
        ref={nextRef}
        className="flex absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <FaArrowRight className="text-black w-5 h-5" />
      </button>

      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={12}
        slidesPerView={2.2}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.activeIndex);
          setTimeout(() => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        breakpoints={{
          480: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full"
      >
        {sortedDeals.map((deal, index) => {
          const isActive = activeIndex === index;
          const showHotDealTag = isActive && deal.tag === "HOT DEAL";

          return (
            <SwiperSlide key={deal._id || index}>
              <div
                onClick={() => handleCardClick(index)}
                className={`mx-auto max-w-sm rounded-2xl p-3 sm:p-6 text-center shadow-xl transition-all duration-300 transform flex flex-col justify-between
                ${
                  isActive
                    ? "scale-105 mt-3 sm:mt-5 mb-10 sm:mb-20 z-10 border-2 border-lime-500 border-dashed"
                    : "hover:scale-105 mt-5"
                } bg-[#151515] text-white cursor-pointer sm:min-h-[480px]`}
              >
                {showHotDealTag && (
                  <div className="bg-lime-500 text-black text-xs font-bold px-3 py-1 rounded-full inline-block shadow-md sm:mb-3">
                    {deal.tag}
                    {deal.quantity}
                  </div>
                )}

                <h3 className="text-base sm:text-2xl font-semibold sm:mb-1">
                  {deal.title}
                </h3>
                <p className="text-xs sm:text-sm text-yellow-400 text-gray-300">
                  {deal.subtitle}
                </p>
                <p className="text-xl sm:text-3xl font-bold text-lime-400">
                  {deal.price}
                </p>
                <div className="flex justify-center items-center mb-3 sm:mb-4 gap-2">
                  <div className="relative w-60 h-28 sm:w-32 sm:h-32 overflow-hidden">
                    <Image
                      src={deal.image || "/fallback.png"}
                      alt="Deal"
                      fill
                      className="object-contain"
                    />
                  </div>
                  {deal.quantity > 3 && (
                    <div className="text-4xl whitespace-nowrap">
                      X {deal.quantity}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleViewPlanClick(deal)}
                  className="bg-lime-600 hover:bg-lime-700 text-black font-bold py-1.5 px-4 sm:py-2 sm:px-5 rounded-full transition text-sm sm:text-base"
                >
                  Buy Now
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
