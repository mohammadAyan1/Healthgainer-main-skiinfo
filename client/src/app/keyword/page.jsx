"use client";

import React from "react";

const keywords = [
  "India No.1 Weight Gainer",
  "Ayurvedic Weight Gainer",
  "Best Ayurvedic Weight Gainer Powder",
  "Health Gain Powder for Female",
  "Pharma Science Weight Gainer Review",
  "Best Ayurvedic Weight Gainer in India",
  "Ayurvedic Weight Gainer and Health Booster",
  "Best Weight Gain Powder Online",
  "Pharma Science Ayurvedic Weight Gainer Supplement",
  "Mass & Weight Gainers Powder in India",
  "Buy Best Weight Gainer Powder in India",
  "Buy Best Mass Gainer Online In India",
  "Health Gainer Powder in Hindi",
  "Pharma Science Health Gainer Powder",
  "Weight Gainer for Men",
  "Most Popular Items in Mass & Weight Gainers",
  "Best Weight Gainer Powders for Women and Men",
  "Best Mass and Weight Gainers in India 2025",
  "Mass Gainers Online at Lowest Prices",
  "Buy #1 Mass Gainers Powder Online in India",
  "Buy Weight Gainer for Men Online at Best Prices in India",
  "Best Weight Gainer for Men Without Gym",
  "Ayurvedic Gain+ Weight & Mass Gainer",
  "Ayurvedic Weight Gainer for Women",
  "Ayurvedic Mass Gainer powder",
  "Best Ayurvedic Mass Gainer in India",
  "best ayurvedic mass gainer in india",
  "Best Ayurvedic medicine for weight gain",
  "Weight gain Ayurvedic herbs",
  "Gain muscle mass naturally",
  "Health Gainer is unique combination of rare ayurvedic herbs",
  "Buy Ayurvedic Immunity Booster",
  "Buy Ayurvedic Immunity Booster Products Online In India",
  "Best immunity Booster Ayurvedic medicine",
  "aloe vera juice benefits in hindi",
  "Aloe vera juice in india",
  "best aloe vera juice in india",
  "Ayurvedic Medicine for Weight Loss",
  "Ayurvedic weight loss capsules",
  "Weight Loss Ayurvedic medicine in Hindi",
  "Best Ayurvedic medicine for weight loss",
  "best ayurvedic treatment for weight loss",
];

const KeywordCloud = () => (
  <section className="bg-gradient-to-br from-[#e0f7fa] to-[#fff3e0] p-2 mt-1 shadow-inner">
    <div className="flex flex-wrap gap-[4px] text-[10px] sm:text-xs leading-tight text-justify">
      {keywords.map((keyword, index) => (
        <span
          key={index}
          className="rounded bg-white border border-gray-200 text-gray-700 hover:bg-[#d1c4e9] hover:text-black transition-all duration-200 shadow-sm cursor-pointer m-[1px]"
        >
          {keyword}
        </span>
      ))}
    </div>
  </section>
);

export default KeywordCloud;
