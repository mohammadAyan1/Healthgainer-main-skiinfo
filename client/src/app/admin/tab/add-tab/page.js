"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createHealthGainer } from "@/redux/slices/healthGainerSlice";
import { fetchProducts } from "@/redux/slices/productSlice";

const HealthGainerForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    product: "",
    description: "",
    ingredients: "",
    howToUse: "",
    benefits: "",
    prohibitions: "",
    faq: [{ question: "", answer: "" }],
  });

  const { loading: productsLoading, error: productsError } = useSelector((state) => state?.product || {});
  const { products } = useSelector((state) => state?.product?.products || {});
  const { loading: submissionLoading, error: submissionError } = useSelector((state) => state?.healthGainer || {});

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFAQ = [...formData.faq];
    updatedFAQ[index][field] = value;
    setFormData({ ...formData, faq: updatedFAQ });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faq: [...formData.faq, { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index) => {
    const updatedFAQ = formData.faq.filter((_, i) => i !== index);
    setFormData({ ...formData, faq: updatedFAQ });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        ingredients: formData.ingredients.split(",").map((item) => item.trim()),
        benefits: formData.benefits.split(",").map((item) => item.trim()),
        prohibitions: formData.prohibitions.split(",").map((item) => item.trim()),
      };
      
      await dispatch(createHealthGainer(formattedData)).unwrap();
      setSubmissionSuccess(true);
      
      
      setFormData({
        product: "",
        description: "",
        ingredients: "",
        howToUse: "",
        benefits: "",
        prohibitions: "",
        faq: [{ question: "", answer: "" }],
      });
      
      setTimeout(() => setSubmissionSuccess(false), 3000);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Health Gainer Product</h2>
          
          {submissionSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              Health Gainer created successfully!
            </div>
          )}
          
          {submissionError && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              Error: {submissionError.message || "Failed to create Health Gainer"}
            </div>
          )}
          
          {productsError && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              Error loading products: {productsError.message || "Failed to fetch products"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={productsLoading}
              >
                <option value="">Select a product</option>
                {productsLoading ? (
                  <option>Loading products...</option>
                ) : (
                  products?.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingredients <span className="text-gray-500">(comma separated)</span>
              </label>
              <input
                type="text"
                name="ingredients"
                placeholder="e.g., Vitamin C, Zinc, Calcium"
                value={formData.ingredients}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* How to Use */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">How to Use</label>
              <input
                type="text"
                name="howToUse"
                placeholder="e.g., Take 2 tablets daily with water"
                value={formData.howToUse}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Benefits <span className="text-gray-500">(comma separated)</span>
              </label>
              <input
                type="text"
                name="benefits"
                placeholder="e.g., Boosts immunity, Improves digestion"
                value={formData.benefits}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Prohibitions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Prohibitions <span className="text-gray-500">(comma separated)</span>
              </label>
              <input
                type="text"
                name="prohibitions"
                placeholder="e.g., Not for children under 12, Avoid during pregnancy"
                value={formData.prohibitions}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* FAQs Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">FAQs</h3>
                <button
                  type="button"
                  onClick={addFAQ}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add FAQ
                </button>
              </div>

              {formData.faq.map((faq, index) => (
                <div key={index} className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                    {formData.faq.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFAQ(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Question"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Answer"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submissionLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submissionLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {submissionLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Create Health Gainer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthGainerForm;