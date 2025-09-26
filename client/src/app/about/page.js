"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("healthGainer");
  const tabs = [
    { id: "healthGainer", label: "About Health Gainer" },
    { id: "benefits", label: "Key Benefits" },
    { id: "ingredients", label: "Ingredients" },
    { id: "company", label: "Our Company" },
    { id: "mission", label: "Our Mission" },
    { id: "whyChooseUs", label: "Why Choose Us" },
  ];

  const howItWorks = [
    {
      title: "Nutrient Absorption",
      desc: "Enhances your body's ability to absorb and utilize nutrients more effectively",
      icon: "🥗",
    },
    {
      title: "Muscle Development",
      desc: "Supports lean muscle growth with balanced protein synthesis",
      icon: "💪",
    },
    {
      title: "Metabolic Support",
      desc: "Optimizes metabolism for healthy weight management",
      icon: "⚡",
    },
  ];

  const benefits = [
    {
      title: "Healthy Weight Gain",
      desc: "Gain weight gradually and sustainably without unhealthy spikes",
      img: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Improved Digestion",
      desc: "Herbal ingredients support gut health and nutrient absorption",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Enhanced Energy",
      desc: "Experience lasting energy without crashes or jitters",
      img: "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Muscle Tone",
      desc: "Develop lean muscle mass with proper nutrition",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Better Sleep",
      desc: "Natural ingredients promote restful sleep and recovery",
      img: "https://images.unsplash.com/photo-1548600916-dc8492f8e845?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Stronger Immunity",
      desc: "Herbal blend supports your body's natural defenses",
      img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const ingredients = [
    {
      name: "Ashwagandha",
      benefit: "Reduces stress, improves muscle strength",
      highlight: "Adaptogenic properties help manage cortisol",
      icon: "🌿",
    },
    {
      name: "Shatavari",
      benefit: "Enhances nutrient absorption",
      highlight: "Ayurvedic rejuvenative herb",
      icon: "🍃",
    },
    {
      name: "Gokshura",
      benefit: "Supports muscle development",
      highlight: "Natural testosterone support",
      icon: "🌱",
    },
    {
      name: "Premium Protein Blend",
      benefit: "Complete amino acid profile",
      highlight: "Plant & dairy protein combination",
      icon: "💪",
    },
    {
      name: "Healthy Fats",
      benefit: "Sustainable energy source",
      highlight: "MCTs & omega fatty acids",
      icon: "⚡",
    },
    {
      name: "Digestive Enzymes",
      benefit: "Improves nutrient utilization",
      highlight: "Enhances food absorption",
      icon: "🔄",
    },
  ];

  const supplementFacts = [
    { name: "Serving Size", value: "1 Scoop (30g)" },
    { name: "Calories", value: "220kcal" },
    { name: "Protein", value: "24g" },
    { name: "Carbs", value: "28g" },
    { name: "Fats", value: "6g" },
  ];

  const certifications = [
    {
      name: "GMP Certified",
      desc: "Good Manufacturing Practices",
      icon: "🏭",
    },
    {
      name: "ISO 9001",
      desc: "Quality Management System",
      icon: "📋",
    },
    {
      name: "Ayurvedic Approved",
      desc: "Traditional medicine standards",
      icon: "🌿",
    },
  ];

  const missionItems = [
    {
      title: "Vision",
      desc: "To become the most trusted name in natural health solutions worldwide",
      icon: "👁️",
    },
    {
      title: "Mission",
      desc: "Develop scientifically validated Ayurvedic products that deliver real results",
      icon: "🎯",
    },
    {
      title: "Values",
      desc: "Integrity, innovation, and customer-centric approach in everything we do",
      icon: "❤️",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh K.",
      result: "Gained 8kg in 3 months",
      quote: "Finally found something that works without side effects",
    },
    {
      name: "Priya M.",
      result: "Improved digestion and energy",
      quote: "My overall health has transformed, not just my weight",
    },
    {
      name: "Amit S.",
      result: "Muscle tone and strength",
      quote: "Combined with workout, the results are amazing",
    },
  ];

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  };

  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <section className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden mb-2">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Athlete using health gainer product"
            className="object-cover w-full h-full"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="container relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div {...slideUp} className="max-w-4xl">
            <h1 className="text-2xl sm:text-5xl md:text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Transform Your Body With <br />
              <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-primary">
                Health Gainer
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
            >
              Discover the Ayurvedic-powered formula trusted by 50,000+ customers for healthy weight gain and overall wellness
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="/product">
                <button className="bg-primary hover:bg-primary text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Shop Now
                </button>
              </a>
              <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="container mx-auto grid grid-cols-3 divide-x divide-white/20">
              <div className="text-center">
                <p className="text-xl md:text-3xl font-bold text-white">10+</p>
                <p className="text-white/80 text-sm md:text-base">Years of Research</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-3xl font-bold text-white">50K+</p>
                <p className="text-white/80 text-sm md:text-base">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-3xl font-bold text-white">100%</p>
                <p className="text-white/80 text-sm md:text-base">Natural Ingredients</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-center overflow-x-auto py-4 px-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-6 py-2 mx-2 font-semibold rounded-full transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto py-12 px-4">
        {activeTab === "healthGainer" && (
          <motion.div {...fadeIn} className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  The Science of <span className="text-primary">Healthy Weight Gain</span>
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Health Gainer is a revolutionary Ayurvedic formulation designed to support
                  healthy weight gain through natural ingredients. Unlike synthetic supplements, our formula
                  works with your body&apos;s natural processes to promote sustainable results.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  Our product is certified by GMP, Halal, and ISO standards, ensuring the highest quality
                  and safety for our customers. We combine ancient Ayurvedic wisdom with modern scientific
                  research to create a truly effective solution.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>100% natural herbal formulation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>No artificial fillers or harmful chemicals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Supports overall health and immunity</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://www.ipharmascience.com/storage/product_images/1465970499fcce5e6f97612b8e765c41.jpeg"
                  alt="Health Gainer product"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {howItWorks.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-lg shadow-md text-center"
                  >
                    <span className="text-4xl mb-4 inline-block">{item.icon}</span>
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "benefits" && (
          <motion.div {...fadeIn} className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Transform Your <span className="text-primary">Health Journey</span>
              </h2>
              <p className="text-lg text-gray-600">
                Our Health Gainer offers comprehensive benefits that go beyond simple weight gain to support
                your overall wellbeing and vitality.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="relative h-52">
                    <img
                      src={benefit.img}
                      alt={benefit.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "ingredients" && (
          <motion.div {...fadeIn} className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nature&apos;s <span className="text-primary">Powerful Formula</span>
              </h2>
              <p className="text-lg text-gray-600">
                Our scientifically-backed blend combines rare Ayurvedic herbs with modern nutrients
                for safe, effective weight gain and overall wellness.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-md border-t-4 border-primary flex flex-col"
                  >
                    <div className="flex items-start mb-3">
                      <span className="text-2xl mr-3">{ingredient.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {ingredient.name}
                        </h3>
                        <div className="h-1 w-12 bg-primary my-2"></div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2 flex-grow">{ingredient.benefit}</p>
                    <p className="text-sm text-primary font-medium bg-yellow-50 px-3 py-1 rounded-full inline-block">
                      {ingredient.highlight}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="relative group">
                <div className="sticky top-24">
                  <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Natural ingredients composition"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Pure Ayurvedic Herbs
                        </h3>
                        <p className="text-yellow-200">
                          Sourced from organic farms in the Himalayas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                    <h4 className="font-bold text-lg mb-3 text-gray-800">
                      Supplement Facts
                    </h4>
                    <div className="space-y-3">
                      {supplementFacts.map((fact, i) => (
                        <div key={i} className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">{fact.name}</span>
                          <span className="font-medium">{fact.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 mt-8">
              <h3 className="text-center text-xl font-bold text-gray-800 mb-6">
                Quality Certifications
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-4 rounded-lg shadow-sm flex items-center w-48"
                  >
                    <span className="text-3xl mr-3">{cert.icon}</span>
                    <div>
                      <p className="font-semibold">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "company" && (
          <motion.div {...fadeIn} className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Our facility"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our <span className="text-primary">Story</span>
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Founded in 2010, Health Gainer began with a simple mission: to bridge the gap between
                  ancient Ayurvedic wisdom and modern nutritional science. Our team of Ayurvedic doctors,
                  nutritionists, and researchers work tirelessly to develop products that are both effective
                  and safe.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  Today, we&apos;re proud to serve over 500,000 customers worldwide with our GMP-certified
                  manufacturing facilities and rigorous quality control processes. Every batch of our Health
                  Gainer undergoes extensive testing to ensure purity and potency.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-600">10+</p>
                    <p className="text-gray-600">Years in business</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-600">500K+</p>
                    <p className="text-gray-600">Satisfied customers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Our Certifications
              </h3>
              <div className="flex flex-wrap justify-center gap-8">
                {[
                  { name: "GMP Certified", icon: "🏭" },
                  { name: "ISO 9001", icon: "📋" },
                  { name: "Halal Certified", icon: "☪️" },
                  { name: "Ayurvedic Trademark", icon: "🌿" },
                ].map((cert, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="bg-white p-6 rounded-lg shadow-md text-center w-40"
                  >
                    <span className="text-4xl mb-2 inline-block">{cert.icon}</span>
                    <p className="font-semibold">{cert.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "mission" && (
          <motion.div {...fadeIn} className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our <span className="text-primary">Purpose</span>
              </h2>
              <p className="text-lg text-gray-600">
                We exist to empower individuals to achieve their health goals through safe, natural, and
                effective solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {missionItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl shadow-lg text-center h-full"
                >
                  <span className="text-5xl mb-4 inline-block">{item.icon}</span>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                <div className="text-center p-8 max-w-2xl">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Join Our Movement
                  </h3>
                  <p className="text-xl text-gray-200 mb-6">
                    Together, we&apos;re redefining what it means to be healthy and confident in your own skin
                  </p>
                  <a href="/distributorform">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary text-white px-8 py-3 rounded-full font-bold"
                    >
                      Become a Partner
                    </motion.button>
                  </a>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team photo"
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        )}

        {/* Why Choose Us */}
        {activeTab === "whyChooseUs" && (
          <motion.div {...fadeIn} className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The <span className="text-primary">Health Gainer</span> Difference
              </h2>
              <p className="text-lg text-gray-600">
                What sets us apart in the crowded health supplement market
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                {[
                  {
                    title: "Holistic Approach",
                    desc: "We don't just help you gain weight - we improve your overall health",
                  },
                  {
                    title: "Research-Backed",
                    desc: "Our formulas are developed by experts and validated by science",
                  },
                  {
                    title: "Transparent Formulas",
                    desc: "No hidden ingredients or proprietary blends - we disclose everything",
                  },
                  {
                    title: "Customer Support",
                    desc: "Dedicated nutritionists available to guide your journey",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <span className="text-yellow-600 text-xl font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Happy customer"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Customer Success Stories
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-yellow-600">
                          {testimonial.result}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Call to Action */}
      <section className="py-16 px-6 md:px-20 text-center bg-gradient-to-r from-primary to-primary text-white">
        <motion.div {...slideUp} className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8">
            Join thousands who&apos;ve achieved their weight goals naturally with our
            Health Gainer
          </p>

          <a href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black py-3 px-6 rounded-full font-bold"
            >
              Contact Our Experts Now
            </motion.button>
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;