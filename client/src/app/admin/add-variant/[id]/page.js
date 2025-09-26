"use client";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { createVariant } from "@/redux/slices/variantSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_CONFIG = {
  position: "top-center",
  autoClose: 3000
};

const INITIAL_VARIANT_DATA = {
  weight: "",
  mrp: 0,
  discount: 0,
  stock: 0,
  isAvailable: true,
};

export default function AddVariant() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [variantData, setVariantData] = useState(INITIAL_VARIANT_DATA);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setVariantData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!variantData.weight.trim() || variantData.mrp <= 0) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("weight", variantData.weight.trim());
    formData.append("mrp", variantData.mrp);
    formData.append("discount", variantData.discount);
    formData.append("stock", variantData.stock);
    formData.append("isAvailable", variantData.isAvailable);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await dispatch(createVariant({ id, formData })).unwrap();
      toast.success("Variant created successfully!");

      imagePreview.forEach(url => URL.revokeObjectURL(url));
      router.push(`/admin/products/${id}`);
    } catch (error) {
      console.error("Failed to create variant:", error);
      toast.error(error.message || "Failed to create variant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      label: "Weight",
      name: "weight",
      type: "text",
      required: true,
      placeholder: "e.g., 500g, 1kg"
    },
    {
      label: "MRP",
      name: "mrp",
      type: "number",
      required: true,
      min: 0,
      step: "0.01"
    },
    {
      label: "Discount (%)",
      name: "discount",
      type: "number",
      required: false,
      min: 0,
      max: 100
    },
    {
      label: "Stock",
      name: "stock",
      type: "number",
      required: true,
      min: 0
    }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer {...TOAST_CONFIG} />
      
      <h2 className="text-2xl font-semibold mb-6">
        Add Variant for Product ID: {id}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 mb-1 font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={variantData[field.name]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required={field.required}
                min={field.min}
                max={field.max}
                step={field.step}
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Upload Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
              required
            />
          </div>
        </div>

        {imagePreview.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Image Preview:</h3>
            <div className="flex flex-wrap gap-3">
              {imagePreview.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {imagePreview.length} image(s) selected
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 min-w-[120px] ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Add Variant"
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.push(`/admin/products/${id}`)}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}