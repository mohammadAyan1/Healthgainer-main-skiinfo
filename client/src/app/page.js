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

const page = () => {
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
      <InfiniteScrollText />
      <WhatsAppButton />
    </div>
  );
};

export default page;
