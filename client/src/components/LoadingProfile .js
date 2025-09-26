import { motion } from "framer-motion";
import Link from "next/link";

const LoadingProfile = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-6xl"
      >
        🚀
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="text-2xl font-bold text-gray-700 mt-4 text-center"
      >
        Your Profile is on its Way! ✨
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="text-gray-600 text-lg mt-2 text-center"
      >
        But first, let’s get you signed in to unlock all the magic! 🔐
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="mt-6"
      >
        <Link href="/auth">
          <button className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Sign In Now 🚀
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default LoadingProfile;
