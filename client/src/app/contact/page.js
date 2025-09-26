"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createContact } from "@/redux/slices/contactSlice";
import { toast } from "react-toastify";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiArrowRight,
} from "react-icons/fi";

const ContactPage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    if (!name || !email || !message) {
      toast.error("Please fill all fields!");
      return;
    }

    setIsSubmitting(true);

    dispatch(createContact(form))
      .unwrap()
      .then(() => {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => {
        toast.error("Failed to send message. Please try again!");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <section
        className="relative flex items-center justify-center h-96 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1075&q=80')",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let&apos;s <span className="text-white">Connect</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            We&apos;re here to help and answer any questions you might have. We
            look forward to hearing from you!
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12"
          >
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primary text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <FiSend className="text-lg" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:w-1/2">
              <div className="h-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Contact Information
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      icon: <FiMapPin className="text-primary text-2xl" />,
                      title: "Our Location",
                      content:
                        "5/11 Pharmascience Amer complex in front of PNB Bank M.P. Nagar zone 2 Bhopal",
                      link: "https://maps.google.com",
                      linkText: "View on map",
                    },
                    {
                      icon: <FiMail className="text-primary text-2xl" />,
                      title: "Email Us",
                      content: "teamhealthgainer@gmail.com",
                      link: "mailto:teamhealthgainer@gmail.com",
                      linkText: "Send email",
                    },
                    {
                      icon: <FiPhone className="text-primary text-2xl" />,
                      title: "Call Us",
                      content: "+9174006-74000, 95221-95222",
                      link: "tel:+917400674000",
                      linkText: "Call now",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="mt-1">{item.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{item.content}</p>
                        <a
                          href={item.link}
                          className="inline-flex items-center text-primary hover:text-yellow-700 mt-2 transition"
                        >
                          {item.linkText}
                          <FiArrowRight className="ml-1" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Us on Map
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit our headquarters or drop by to say hello. We&apos;d love to
              meet you in person!
            </p>
          </motion.div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <iframe
              className="w-full h-96"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3730.389747804958!2d77.43226644563734!3d23.232024162031202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sPharmascience%20Amer%20complex%20in%20front%20of%20PNB%20Bank%20M.P.%20Nagar%C2%A0zone%C2%A02%C2%A0Bhopal!5e0!3m2!1sen!2sin!4v1752735533816!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="text-xl text-yellow-100 mb-8 max-w-3xl mx-auto">
              Our team is standing by to help you achieve your weight gain
              goals. Get in touch today for personalized advice and support.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
