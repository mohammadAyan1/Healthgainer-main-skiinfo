import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthGainerByProduct } from "../redux/slices/healthGainerSlice";
import { motion, AnimatePresence } from "framer-motion";
import ReviewSection from "@/components/ReviewSection";
import ReviewsList from "@/components/ReviewsList ";

import { 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiInfo,
 
  FiActivity,
  FiAlertCircle,
  FiHelpCircle
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const tabs = [
  { id: "Description", icon: <FiInfo className="text-blue-500" /> },
  { id: "Ingredientssssssssssssssssssssssssssssssss", icon: <FaLeaf className="text-green-500" /> },
  { id: "How To Use", icon: <FiActivity className="text-purple-500" /> },
  { id: "Benefits", icon: <FiCheckCircle className="text-emerald-500" /> },
  { id: "Prohibition", icon: <FiAlertCircle className="text-red-500" /> },
  { id: "FAQ", icon: <FiHelpCircle className="text-amber-500" /> },
  {id: "Testimonials", icon: <FiAlertCircle className="text-red-500" />}
];

const HealthGainerTabs = ({ productId }) => {
  const dispatch = useDispatch();
  const { healthGainers, loading, error } = useSelector((state) => state.healthGainer);
  
  const data = healthGainers.length > 0 ? healthGainers[0] : null;
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    if (productId) {
      dispatch(fetchHealthGainerByProduct(productId));
    }
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Skeleton key={tab.id} width={100} height={40} className="rounded-full" />
          ))}
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <Skeleton count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-4 md:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">No health gainer data available for this product.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabContent = {
    Description: (
      <div className="prose prose-sm max-w-none">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
        <p className="text-gray-700 leading-relaxed">{data.description}</p>
      </div>
    ),
    Ingredients: (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Ingredients</h3>
        <ul className="space-y-3">
          {data.ingredients.map((item, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                <FaLeaf className="text-green-500" />
              </div>
              <span className="text-gray-700">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    ),
    "How To Use": (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Usage Instructions</h3>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiActivity className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 whitespace-pre-line">{data.howToUse}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    Benefits: (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Health Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                <FiCheckCircle className="text-emerald-500" />
              </div>
              <span className="text-gray-700">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    Prohibition: (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Precautions & Warnings</h3>
        <div className="space-y-3">
          {data.prohibitions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                <FiAlertTriangle className="text-red-500" />
              </div>
              <span className="text-red-600">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    FAQ: (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {data.faq.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <h4 className="font-medium text-gray-800 flex items-start gap-2">
                <FiHelpCircle className="text-amber-500 mt-1 flex-shrink-0" />
                {faq.question}
              </h4>
              <p className="mt-2 text-gray-600 pl-7">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    Testimonials: (
      <div>
        <ReviewSection productId={productId} />
        <ReviewsList productId={productId} />
      </div>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto py-4 md:p-6">
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white shadow-md text-gray-900 border border-gray-200"
                  : "text-gray-700 bg-gray-50 border border-primary-200 shadow-md md:hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.id}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:p-6 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HealthGainerTabs;