import React, { useState } from 'react';
import { FaFacebookF, FaPinterestP, FaInstagram, FaTwitter, FaHome, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = React.useMemo(() => [
    { label: 'Home', href: '/', icon: <FaHome /> },
    { label: 'Product', href: '/product' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Media & Reports', href: '/media' },
    { label: 'Get Distributorship', href: '/distributor' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ], []);

  const toggleMenu = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const SocialIcons = React.useMemo(() => (
    <>
      <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
        <FaFacebookF />
      </a>
      <a href="#" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
        <FaPinterestP />
      </a>
      <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors duration-200">
        <FaInstagram />
      </a>
      <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors duration-200">
        <FaTwitter />
      </a>
    </>
  ), []);

  return (
    <header className="bg-white shadow-md">
      <div className="bg-gray-100 py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-10 w-auto"
              loading="lazy"
              width={120}
              height={40}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              {SocialIcons}
            </div>
            <span className="text-gray-700 font-medium whitespace-nowrap">
              CALL US NOW: +917400674000
            </span>
          </div>
        </div>
      </div>

      <nav className="bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">

            <div className="hidden md:flex space-x-6">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {link.icon && React.cloneElement(link.icon, { className: "mr-1" })}
                  {link.label}
                </a>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <FaShoppingCart className="text-gray-700 text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden bg-white py-2 border-t">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    {link.icon && React.cloneElement(link.icon, { className: "mr-2" })}
                    {link.label}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Navbar);