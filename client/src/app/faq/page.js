"use client";
import { useState } from "react";

const faqs = [
  {
    question: "💪 How do weight gain supplements work?",
    answer:
      "Weight gain supplements provide extra calories and protein to help you build muscle and increase body mass effectively.",
  },
  {
    question: "🥤 When should I take my mass gainer?",
    answer:
      "You can take your mass gainer post-workout for muscle recovery or as a meal replacement for extra calories.",
  },
  {
    question: "🏋️‍♂️ Do I need to exercise while taking weight gain supplements?",
    answer:
      "Yes! Combining supplements with strength training helps you gain lean muscle instead of just fat.",
  },
  {
    question: "🍗 What foods help in weight gain naturally?",
    answer:
      "High-protein foods like chicken, eggs, nuts, dairy, and complex carbs like rice and oats support healthy weight gain.",
  },
  {
    question: "❓ Are there any side effects of weight gain supplements?",
    answer:
      "Most supplements are safe when taken as recommended, but excessive consumption may lead to digestion issues or fat gain.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        🤔 Frequently Asked Questions
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Find answers to your weight gain supplement queries here! 💪
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300">
            <button
              className="w-full flex justify-between items-center py-4 text-lg font-medium text-gray-800 focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="text-2xl">
                {openIndex === index ? "🔼" : "🔽"}
              </span>
            </button>
            {openIndex === index && (
              <p className="text-gray-600 pb-4">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
