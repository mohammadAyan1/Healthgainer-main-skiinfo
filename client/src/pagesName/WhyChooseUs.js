"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeatures } from "@/redux/slices/why-choose/feature-slice";
import { fetchAdvantages } from "@/redux/slices/why-choose/advantage-slice";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const WhyChooseUs = () => {
  const dispatch = useDispatch();
  const { features } = useSelector((state) => state.features);
  const { advantages } = useSelector((state) => state.advantages);

  useEffect(() => {
    dispatch(fetchFeatures());
    dispatch(fetchAdvantages());
  }, [dispatch]);

  return (
    <section className="bg-black text-white py-12 md:py-16 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Why <span>Choose Us</span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Trusted by athletes and fitness enthusiasts worldwide
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-2/5"
          >
            <img
              src="/choose.png"
              alt="Our products"
              className="rounded-lg object-cover w-full h-auto max-h-[300px] md:max-h-[350px]"
            />
          </motion.div>

          <div className="w-full lg:w-3/5">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-8"
            >
              {features.map((stat, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex flex-col items-center ${
                    stat.highlight ? "bg-red-600" : "bg-gray-800"
                  }`}
                >
                  <img src={stat.imageUrl} alt="icon" className="w-6 h-6 mb-1" />
                  <p className="font-bold text-sm md:text-base">{stat.title}</p>
                  <p className="text-xs text-gray-300 text-center">{stat.description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold mb-4">Our Advantages</h3>
              <div className="grid grid-cols-2 gap-3">
                {advantages.map((adv, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="text-white w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-300">{adv.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
