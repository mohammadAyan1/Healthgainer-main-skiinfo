"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewsSection() {
    const router = useRouter();

    return (
        <div className="relative flex flex-col md:flex-row items-center justify-center bg-black text-white px-8 py-12 md:px-16 md:py-20 space-y-10 md:space-y-0 md:space-x-10 shadow-2xl  overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_10%,_transparent_50%)] pointer-events-none"></div>
    <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-30"></div>
    <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-30"></div>

    <div className="relative hidden md:flex items-center justify-center w-1/5">
        <div className="relative w-52 h-52 transform transition-all duration-500 hover:scale-110">
            <Image
                src="/1.png"
                alt="News Image"
                width={250}
                height={250}
                className="h-full w-full object-cover rounded-xl shadow-lg border-4 border-yellow-400 hover:shadow-2xl animate-pulse"
            />
        </div>
    </div>
    <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Latest Health & Fitness News</h2>
        <button
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold text-lg rounded-xl shadow-lg hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-yellow-400"
            onClick={() => router.push("/news")}
        >
            Read More on HealthGainer
        </button>
    </div>

    <div className="group relative flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 h-48 p-6 rounded-xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 border-2 border-yellow-500">
        <a
            href="https://thereaderstime.in/best-ayurvedic-weight-gainer-powder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center space-y-3 transition-opacity duration-300 group-hover:opacity-80"
        >
            <img
                src="https://thereaderstime.in/wp-content/uploads/2023/02/The-Readers-Time-Logo-mobile.png"
                alt="The Readers Time"
                className="cursor-pointer w-44 md:w-48"
            />
            <p className="text-center text-sm text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                Read More on The Readers Time
            </p>
        </a>
    </div>

    <div className="group relative flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 h-48 p-6 rounded-xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 border-2 border-yellow-500">
        <a
            href="https://www.hindustantimes.com/lifestyle/health/best-weight-gainer-10-options-to-see-maximum-results-101705308650209.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center space-y-3 transition-opacity duration-300 group-hover:opacity-80"
        >
            <img
                src="https://www.hindustantimes.com/static-content/1y/ht/ht_100_logo.webp"
                alt="Hindustan Times"
                className="cursor-pointer w-44 md:w-48"
            />
            <p className="text-center text-sm text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                Read More on Hindustan Times
            </p>
        </a>
    </div>
</div>
    );
}