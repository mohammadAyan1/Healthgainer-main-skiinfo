"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createReq } from "@/redux/slices/reqCallbackSlice";

export default function CallbackForm() {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { name, email, phone } = formData;
    if (!name || !email || !phone) return toast.error("Please fill all fields!");
    setLoading(true);

    dispatch(createReq(formData))
      .unwrap()
      .then(() => {
        setSubmitted(true);
        toast.success("Your request has been submitted!");
        setFormData({ name: "", email: "", phone: "" });
      })
      .catch(() => toast.error("Something went wrong. Please try again."))
      .finally(() => setLoading(false));
  }, [formData, dispatch]);

  const closeForm = useCallback(() => setShowForm(false), []);

  const formFields = useMemo(() => 
    ["name", "email", "phone"].map((field) => ({
      key: field,
      type: field === "email" ? "email" : field === "phone" ? "tel" : "text",
      name: field,
      placeholder: `Your ${field.charAt(0).toUpperCase() + field.slice(1)}`,
      value: formData[field]
    }))
  , [formData]);

  const buttonText = useMemo(() => 
    loading ? "Submitting..." : "Submit",
  [loading]);

  if (!showForm) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="bg-black p-8 rounded-xl shadow-2xl w-full max-w-md relative text-white border border-gray-700">

        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={closeForm}
          aria-label="Close form"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Request a Callback 📲</h2>

        {submitted ? (
          <p className="text-center text-green-400 font-semibold">
            Thank you! We&apos;ll contact you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {formFields.map(({ key, type, name, placeholder, value }) => (
              <input
                key={key}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="w-full p-3 bg-black text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              />
            ))}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-primary hover:bg-blue-700"
              } text-white`}
            >
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}