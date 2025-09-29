"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import withAuth from "@/hoc/withAuth";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900 dark:!text-white transition-colors duration-200'>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className='flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-200'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(AdminLayout, ["Admin"]);
