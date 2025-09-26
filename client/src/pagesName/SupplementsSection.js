'use client';

import { motion } from 'framer-motion';

export default function SupplementsSection() {
    return (
        <section className="relative bg-white py-16 px-6 lg:px-20 text-center">
            <div
                className="absolute inset-0 bg-cover bg-top opacity-90 blur-lg"
                style={{
                    backgroundImage: "url('https://themebuz.com/html/vigo/demo/vigo-green/img/features-bg.png')",
                }}
            ></div>
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h3 className="text-2xl italic text-primary drop-shadow-md">
                    Four Amazing
                </h3>
                <h2 className="text-4xl font-extrabold text-gray-900">Supplements in One</h2>
                <div className="w-16 h-1 bg-primary mx-auto mt-2"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-12 relative z-10">
                {supplements.map((supplement, index) => (
                    <motion.div
                        key={index}
                        className="relative flex flex-col items-center p-6 rounded-2xl border border-primary shadow-lg bg-white/30 backdrop-blur-lg transition-all"
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 128, 0, 0.3)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300"></div>

                        <motion.div
                            className="relative w-20 h-20 flex items-center justify-center bg-white/40 rounded-full border-2 border-green-500 p-4 shadow-md"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <img
                                src={supplement.icon}
                                alt={supplement.title}
                                className="w-12 h-12 transition-transform duration-300 hover:scale-110"
                            />
                        </motion.div>

                        <h3 className="text-lg font-bold text-gray-900 mt-4">{supplement.title}</h3>
                        <p className="text-gray-600 text-sm">{supplement.description}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="mt-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
              <motion.button
          className="mt-6 px-6 py-3 rounded-lg text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff8c00] to-[#ff4500] hover:from-[#ff4500] hover:to-[#ff8c00] transform hover:scale-105 transition-all duration-500 ease-in-out"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
                    Get Started Now
                </motion.button>
            </motion.div>
        </section>
    );
}

const supplements = [
    {
        title: 'Calorie Build Up',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some humour dummy now it.',
        icon: 'https://themebuz.com/html/vigo/demo/vigo-red/img/features-icon-1.png',
    },
    {
        title: 'Fit The Body',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some humour dummy now it.',
        icon: 'https://themebuz.com/html/vigo/demo/vigo-red/img/features-icon-2.png',
    },
    {
        title: 'Energy Grow Up',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some humour dummy now it.',
        icon: 'https://themebuz.com/html/vigo/demo/vigo-red/img/features-icon-3.png',
    },
    {
        title: 'Regular Routine',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some humour dummy now it.',
        icon: 'https://themebuz.com/html/vigo/demo/vigo-red/img/features-icon-4.png',
    },
];
