"use client";
import BestSupplementSection from "@/pagesName/BestSupplementSection";
import HeroSection from "@/pagesName/HeroSection";
import InfiniteScrollText from "@/pagesName/InfiniteScrollText";
import React from "react";
import CallbackForm from "@/components/CallbackForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import DealsOfTheDay from "@/pagesName/DealsOfTheDay";
import ReviewCarousel from "@/pagesName/ReviewCarousel";
import NewsSlider from "@/pagesName/NewsSlider";
import WhyChooseUs from "@/pagesName/WhyChooseUs";
import CertificationSection from "@/components/CertificationSection";
import FullScreenVideo from "@/pagesName/FullScreenVideo";
import AyurvedicWeightGainer from "@/pagesName/AyurvedicWeightGainer";
import HealthGainerBenefits from "@/pagesName/HealthGainerBenefits";
import NaturalHerbs from "@/pagesName/NaturalHerbs";
import KeywordCloud from "./keyword/page";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      console.log(hash);

      if (hash) {
        console.log("dfghjk");
        
        setTimeout(() => {
          const element = document.querySelector(hash);
          console.log(element);

          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 1100); // 100ms delay
      }
    }
  }, []);

  return (
    <div>
      <HeroSection />
      <AyurvedicWeightGainer />
      <FullScreenVideo />
      <NaturalHerbs />
      <HealthGainerBenefits />
      <BestSupplementSection />
      <ReviewCarousel />
      <CertificationSection />
      <DealsOfTheDay />
      <NewsSlider />
      <WhyChooseUs />
      <KeywordCloud />
      {/* <BlogSection/> */}
      <CallbackForm />
      {/* <Update /> */}
      <InfiniteScrollText />
      <WhatsAppButton />
    </div>
  );
};

export default page;
