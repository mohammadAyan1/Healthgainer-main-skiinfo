"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6 text-center">
            {/* Bodybuilding Emoji */}
            <div className="text-6xl md:text-8xl animate-bounce">💪🏋️‍♂️</div>

            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
                🚫 Access Denied! 🚫
            </h1>
            <p className="text-lg text-gray-600 mt-2">
                Oops! Looks like you have not lifted enough access rights yet! 💪
            </p>
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-600 text-lg mt-2 text-center"
            >
                let’s get you signed in to unlock all the magic! 🔐
            </motion.p>

            {/* Redirect Button */}
            <button
                onClick={() => router.push("/login")}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
                Go to Login Page 🔐
            </button>
        </div>
    );
}
