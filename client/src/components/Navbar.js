// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import {
//   FaFacebookF,
//   FaPinterestP,
//   FaInstagram,
//   FaTwitter,
//   FaHome,
//   FaShoppingCart,
//   FaBars,
//   FaTimes,
//   FaUser,
// } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCart } from '@/redux/slices/cartSlice';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { items } = useSelector((state) => state.cart);

//   useEffect(() => {
//     if (user?._id) {
//       dispatch(fetchCart(user._id));
//     }
//   }, [dispatch, user?._id]);

//  useEffect(() => {
//     let guestId;
//     if (!user?._id) {
//       guestId = localStorage.getItem("guestId");

//     }

//     if (user?._id) {
//       dispatch(fetchCart(user._id));
//     } else {
//       dispatch(fetchCart(guestId));
//     }
//   }, [dispatch, user]);

//   const navLinks = [
//     { label: 'Home', href: '/', icon: <FaHome className="text-green-500" /> },
//     { label: 'Product', href: '/product' },
//     { label: 'Testimonials', href: '/testimonials' },
//     { label: 'Media & Reports', href: '/media' },
//     { label: 'Get Distributorship', href: '/distributorform' },
//     { label: 'About', href: '/about' },
//     { label: 'Contact', href: '/contact' },
//   ];

//   return (
//     <header className="w-full bg-black text-white font-sans shadow-md">
//       {/* Top Bar: Social + Call */}
//       <div className="hidden md:flex justify-end items-center px-4 py-2 space-x-4 text-sm sm:text-base">
//         <div className="flex items-center space-x-3 text-xl">
//           <a
//             href="https://www.facebook.com/ipharmasciences"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Facebook"
//             className="hover:text-green-500"
//           >
//             <FaFacebookF />
//           </a>
//           <a
//             href="https://in.pinterest.com/pharma_science/"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Pinterest"
//             className="hover:text-green-500"
//           >
//             <FaPinterestP />
//           </a>
//           <a
//             href="https://www.instagram.com/pharmascienceayurveda/"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Instagram"
//             className="hover:text-green-500"
//           >
//             <FaInstagram />
//           </a>
//           <a
//             href="https://x.com/Pharmascience_"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Twitter"
//             className="hover:text-green-500"
//           >
//             <FaTwitter />
//           </a>
//         </div>
//         <span className="ml-4">
//           CALL US NOW: <strong>+91 74006 74000</strong>
//         </span>
//       </div>

//       {/* Main Navbar */}
//       <div className="flex items-center justify-between px-4 md:px-8 py-2">
//         <Link href="/">
//           <img src="/logos.png" alt="Logo" className="h-10 md:h-20 w-auto" />
//         </Link>

//         {/* Desktop Menu */}
//         <nav className="hidden md:flex items-center space-x-8">
//           {navLinks.map((link) => (
//             <Link
//               key={link.label}
//               href={link.href}
//               className="flex items-center gap-1 text-white font-semibold hover:text-green-500 transition-colors duration-200"
//             >
//               {link.icon}
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         {/* Cart & User */}
//         <div className="hidden md:flex items-center space-x-4">
//           <Link href="/cart" className="relative">
//             <FaShoppingCart size={24} className="text-white hover:text-green-500" />
//             <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
//               {items?.length || 0}
//             </span>
//           </Link>
//           {user ? (
//             <Link href="/user" className="ml-4 font-semibold capitalize hover:text-green-500">
//               Hi, {user.firstName || 'User'}
//             </Link>
//           ) : (
//             <Link
//               href="/login"
//               className="ml-4 text-white bg-primary px-4 py-2 rounded-lg hover:text-green-500 transition-colors duration-200 flex items-center"
//             >
//               <FaUser size={20} />
//             </Link>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button onClick={() => setIsOpen(!isOpen)}>
//             {isOpen ? <FaTimes size={26} /> : <FaBars size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-black px-4 pb-4 space-y-4">
//           <nav className="flex flex-col space-y-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 onClick={() => setIsOpen(false)}
//                 className="flex items-center gap-2 text-white font-semibold hover:text-green-500 transition-colors duration-200"
//               >
//                 {link.icon}
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           <div className="flex items-center space-x-4 pt-2">
//             <Link href="/cart" onClick={() => setIsOpen(false)} className="relative">
//               <FaShoppingCart size={24} className="text-white hover:text-green-500" />
//               <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {items?.length || 0}
//               </span>
//             </Link>
//             {user ? (
//               <Link href="/user" onClick={() => setIsOpen(false)} className="font-semibold text-white hover:text-green-500">
//                 Hi, {user.firstName || 'User'}
//               </Link>
//             ) : (
//               <Link
//                 href="/login"
//                 onClick={() => setIsOpen(false)}
//                 className="text-white bg-primary px-4 py-2 rounded-lg hover:text-green-500 transition-colors duration-200 flex items-center"
//               >
//                 <FaUser size={20} />
//               </Link>
//             )}
//           </div>

//           {/* Mobile Social Icons */}
//           <div className="flex items-center space-x-3 pt-4">
//             <a href="#" className="hover:text-green-500"><FaFacebookF /></a>
//             <a href="#" className="hover:text-green-500"><FaPinterestP /></a>
//             <a href="#" className="hover:text-green-500"><FaInstagram /></a>
//             <a href="#" className="hover:text-green-500"><FaTwitter /></a>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaPinterestP,
  FaInstagram,
  FaTwitter,
  FaHome,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/redux/slices/cartSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    let guestId;
    if (!user?._id) {
      guestId = localStorage.getItem("guestId");
    }

    if (user?._id) {
      dispatch(fetchCart(user._id));
    } else {
      dispatch(fetchCart(guestId));
    }
  }, [dispatch, user]);

  const navLinks = [
    { label: "Home", href: "/", icon: <FaHome className="text-green-500" /> },
    { label: "Product", href: "/product" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Media & Reports", href: "/media" },
    { label: "Get Distributorship", href: "/distributorform" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-black text-white font-sans shadow-md">
      {/* Top Bar: Social + Call */}
      <div className="flex justify-between md:justify-end items-center px-4 py-2 space-x-4 text-xs sm:text-sm md:text-base">
        <div className="flex items-center space-x-2 md:space-x-3 text-lg md:text-xl">
          <a
            href="https://www.facebook.com/ipharmasciences"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-green-500"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://in.pinterest.com/pharma_science/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
            className="hover:text-green-500"
          >
            <FaPinterestP />
          </a>
          <a
            href="https://www.instagram.com/pharmascienceayurveda/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-green-500"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/Pharmascience_"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-green-500"
          >
            <FaTwitter />
          </a>
        </div>
        <span className="text-xs sm:text-sm md:ml-4">
          CALL US NOW: <strong>+91 74006 74000</strong>
        </span>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-2">
        <Link href="/">
          <img src="/logos.png" alt="Logo" className="h-10 md:h-20 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-white font-semibold hover:text-green-500 transition-colors duration-200"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart & User */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <FaShoppingCart
              size={24}
              className="text-white hover:text-green-500"
            />
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {items?.length || 0}
            </span>
          </Link>
          {user ? (
            <Link
              href="/user"
              className="ml-4 font-semibold capitalize hover:text-green-500"
            >
              {"👤" || "User"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-4 text-white bg-primary px-4 py-2 rounded-lg hover:text-green-500 transition-colors duration-200 flex items-center"
            >
              <FaUser size={20} />
            </Link>
          )}
        </div>

        {/* Mobile Cart & User */}
        <div className="md:hidden flex items-center space-x-3">
          <Link href="/cart" className="relative">
            <FaShoppingCart
              size={20}
              className="text-white hover:text-green-500"
            />
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {items?.length || 0}
            </span>
          </Link>
          {user ? (
            <Link
              href="/user"
              className="font-semibold capitalize hover:text-green-500 text-sm"
            >
              👤
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-white bg-primary px-3 py-1 rounded-lg hover:text-green-500 transition-colors duration-200 flex items-center"
            >
              <FaUser size={16} />
            </Link>
          )}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black px-4 pb-4 space-y-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-white font-semibold hover:text-green-500 transition-colors duration-200 py-2"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Cart & User Info */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <Link
                href="/cart"
                className="flex items-center gap-2 text-white hover:text-green-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FaShoppingCart size={18} />
                <span>Cart ({items?.length || 0})</span>
              </Link>
              {user ? (
                <Link
                  href="/user"
                  className="flex items-center gap-2 text-white hover:text-green-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser size={18} />
                  <span>Profile</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-white hover:text-green-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
