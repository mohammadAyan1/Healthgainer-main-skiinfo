"use client";

import { useState, useEffect, use } from "react";
import {
  Menu,
  X,
  Home,
  Box,
  Star,
  Info,
  Leaf,
  ShoppingCart,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaSkype,
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSearch,
} from "react-icons/fa";
import { MdAccountCircle, MdPhone, MdHelpOutline } from "react-icons/md";
import CartBadge from "./CartBadge";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "@/redux/slices/authSlice";
import { getUserProfile } from "@/redux/slices/authSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.user?.user) || null;

  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch(getUserProfile()); // ✅ API call sirf ek baar on mount
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false); // Hide on scroll down
      } else {
        setVisible(true); // Show on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (href) => pathname === href;

  const handleProfileClick = () => {
    if (user) {
      router.push("/user"); // Redirect to user profile
    } else {
      router.push("/login"); // Redirect to login page
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block">
        <div className="bg-primary text-white md:py-2 px-4 flex flex-wrap items-center justify-between fixed top-0 w-full z-50">
          {/* Left: Social Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <FaSkype className="cursor-pointer hover:opacity-80" />
            <FaYoutube className="cursor-pointer hover:opacity-80" />
            <FaFacebookF className="cursor-pointer hover:opacity-80" />
            <FaTwitter className="cursor-pointer hover:opacity-80" />
            <FaInstagram className="cursor-pointer hover:opacity-80" />
          </div>

          {/* Right: Account, Help, Phone, Search */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Profile or Login Button */}
            <div
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
              onClick={handleProfileClick}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
                {currentUser ? (
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <MdAccountCircle className="text-2xl text-black" />
                )}
              </div>
              <span className="hidden sm:inline">
                {currentUser
                  ? `${currentUser.firstName} ${currentUser.lastName}`
                  : "Account Log In"}
              </span>
            </div>

            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
                <MdHelpOutline className="text-2xl text-black" />
              </div>
              <span
                onClick={() => router.push("/faq")}
                className="hidden sm:inline"
              >
                Ask Your Question
              </span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
                <MdPhone className="text-xl text-black" />
              </div>
              <span className="hidden sm:inline">+001 142 1426</span>
            </div>
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
              <FaSearch className="text-xl text-black cursor-pointer hover:opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className={`bg-white shadow-md fixed md:top-12 w-full z-40 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto text-black flex justify-between items-center md:py-2 px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-primary text-2xl font-bold">
              <img
                className="w-32 md:w-36"
                src="https://healthgainer.in/storage/home_logo/903eff30a32b73d3ca5544ea4bdcae8e.png"
                alt="Logo"
              />
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-gray-600">
            <Link
              href="/"
              className={`flex items-center space-x-2 ${
                isActive("/")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/product"
              className={`flex items-center space-x-2 ${
                isActive("/product")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Box size={18} />
              <span>Product</span>
            </Link>
            <Link
              href="/testimonials"
              className={`flex items-center space-x-2 ${
                isActive("/testimonials")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Box size={18} />
              <span>Testimonials</span>
            </Link>
            <Link
              href="/mediareport"
              className={`flex items-center space-x-2 ${
                isActive("/mediareport")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Box size={18} />
              <span>Media & Reports</span>
            </Link>
            {/* <Link href="/feature" className={`flex items-center space-x-2 ${isActive('/feature') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>
              <Star size={18} />
              <span>Feature</span>
            </Link> */}

            <Link
              href="/distributorform"
              className={`flex items-center space-x-2 ${
                isActive("/distributorform")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Leaf size={18} />
              <span>Get Distributorship</span>
            </Link>
            <Link
              href="/about"
              className={`flex items-center space-x-2 ${
                isActive("/about")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Info size={18} />
              <span>About</span>
            </Link>
            {/* <Link href="/order" className={`flex items-center space-x-2 ${isActive('/order') ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}>
              <ShoppingCart size={18} />
              <span>Order</span>
            </Link> */}
            <Link
              href="/contact"
              className={`flex items-center space-x-2 ${
                isActive("/contact")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Phone size={18} />
              <span>Contact</span>
            </Link>
          </div>

          {/* Order Button */}
          <div className="hidden md:block">
            <button className="bg-primary text-white px-4 py-2 rounded-lg">
              <Link href="/cart" className="flex items-center space-x-2">
                {/* <ShoppingCart size={18} /> */}
                <CartBadge />
              </Link>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 bg-white shadow-md p-4  text-gray-800">
            {/* Profile Section */}
            <div className="flex items-center justify-between border-b pb-3">
              <div
                onClick={handleProfileClick}
                className="flex items-center space-x-3"
              >
                {user ? (
                  <img
                    src={user?.profilePhoto || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border"
                  />
                ) : (
                  <MdAccountCircle className="text-2xl text-black" />
                )}
                <span className="font-semibold text-gray-800">My Account</span>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg ">
                <Link
                  href="/cart"
                  className="flex items-center justify-center space-x-2"
                >
                  <CartBadge />
                </Link>
              </button>
            </div>

            {/* Navigation Links */}
            <Link
              href="/"
              className={`flex items-center space-x-2 ${
                isActive("/")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/product"
              className={`flex items-center space-x-2 ${
                isActive("/product")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Box size={18} />
              <span>Product</span>
            </Link>
            <Link
              href="/feature"
              className={`flex items-center space-x-2 ${
                isActive("/feature")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Star size={18} />
              <span>Feature</span>
            </Link>
            <Link
              href="/about"
              className={`flex items-center space-x-2 ${
                isActive("/about")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Info size={18} />
              <span>About</span>
            </Link>
            <Link
              href="/distributorform"
              className={`flex items-center space-x-2 ${
                isActive("/distributorform")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Leaf size={18} />
              <span>Distributor Form</span>
            </Link>
            <Link
              href="/order"
              className={`flex items-center space-x-2 ${
                isActive("/order")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <ShoppingCart size={18} />
              <span>Order</span>
            </Link>
            <Link
              href="/contact"
              className={`flex items-center space-x-2 ${
                isActive("/contact")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <Phone size={18} />
              <span>Contact</span>
            </Link>
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
              <div className=" flex items-center justify-center bg-white rounded-full">
                <MdHelpOutline size={18} className=" text-black" />
              </div>
              <span onClick={() => router.push("/faq")} className=" sm:inline">
                Ask Your Question
              </span>
            </div>

            {/* Cart Button */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <FaSkype className="cursor-pointer hover:opacity-80" />
              <FaYoutube className="cursor-pointer hover:opacity-80" />
              <FaFacebookF className="cursor-pointer hover:opacity-80" />
              <FaTwitter className="cursor-pointer hover:opacity-80" />
              <FaInstagram className="cursor-pointer hover:opacity-80" />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
