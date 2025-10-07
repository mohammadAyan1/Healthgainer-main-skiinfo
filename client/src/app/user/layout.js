"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiHome,
  FiShoppingBag,
  FiMapPin,
  FiUser,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import withAuth from "@/hoc/withAuth";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleLogout = () => {
    router.push("/user/logout");
    router.refresh();
  };

  const navItems = [
    { href: "/user", label: "Dashboard", icon: <FiHome className="mr-3" /> },
    {
      href: "/user/user-orders",
      label: "My Orders",
      icon: <FiShoppingBag className="mr-3" />,
    },
    {
      href: "/user/address",
      label: "My Address",
      icon: <FiMapPin className="mr-3" />,
    },
    {
      href: "/user/account-details",
      label: "Account Details",
      icon: <FiUser className="mr-3" />,
    },

    { href: "/", label: "Home", icon: <FiHome className="mr-3" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative ">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 p-12 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Account</h1>
        <button
          className="text-2xl text-gray-700 focus:outline-none"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>
      </header>

      <div className="flex  lg:pt-0">
        {/* Sidebar - Fixed for desktop, overlay for mobile */}
        <div
          className={`fixed lg:static top-16 md:top-0 inset-0 z-10 lg:z-0 bg-black bg-opacity-50 lg:bg-transparent ${
            isSidebarOpen ? "block" : "hidden"
          } lg:block`}
          onClick={closeSidebar}
        >
          <aside
            className={`w-72 h-[90vh] lg:h-[80vh]  md:mt-0 bg-white border-r transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 hidden lg:block border-b">
              <h1 className="text-xl font-bold hidden lg:block">My Account</h1>
            </div>

            <nav className="flex-1 overflow-y-auto mt-14 p-4 space-y-1">
              {navItems.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center py-3 px-4 rounded-lg ${
                    pathname === href
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={closeSidebar}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-b">
              <button
                className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-gray-100 text-left"
                onClick={handleLogout}
              >
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:h-screen overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-4 lg:p-8">
            {/* Desktop Header */}
            {/* <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div> */}

            <div className="bg-white rounded-lg shadow-sm py-4 lg:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withAuth(DashboardLayout, ["user", "Admin"]);
