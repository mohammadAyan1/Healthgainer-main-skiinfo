"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setIsAdminRoute(pathname.startsWith("/admin"));
  }, [pathname]);

  // useEffect(() => {
  //   localStorage.setItem("date", Date.now().toString());
  // }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <Providers>
          {!isAdminRoute && <Navbar />}
          <main>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              draggable
            />
            <ScrollToTopButton />
            {children}
          </main>
          {!isAdminRoute && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
