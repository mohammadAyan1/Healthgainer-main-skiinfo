"use client";
import { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiPlusCircle,
  FiShoppingBag,
} from "react-icons/fi";
import {
  GalleryHorizontal,
  Medal,
  RepeatIcon,
  SparkleIcon,
  Video,
  PhoneCall,
  Mail,
  BarChart2,
} from "lucide-react";
import { MdNoDrinks } from "react-icons/md";
import { Network } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    settings: false,
    whyChoose: false,
    enquiry: false,
  });

  const menuData = useMemo(() => {
    const dashboard = {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiHome size={18} />,
    };

    const mainMenu = [
      { name: "Orders", path: "/admin/orders", icon: <FiPackage size={18} /> },
      { name: "Users", path: "/admin/users", icon: <FiUsers size={18} /> },
      {
        name: "Header Slider",
        path: "/admin/header-slider",
        icon: <GalleryHorizontal size={16} />,
      },
      {
        name: "Benefits",
        path: "/admin/benefits",
        icon: <SparkleIcon size={18} />,
      },
      {
        name: "Supplements",
        path: "/admin/supplements",
        icon: <MdNoDrinks size={18} />,
      },
      {
        name: "Video-carousel",
        path: "/admin/video-carousel",
        icon: <Video size={18} />,
      },
      {
        name: "Distributorship",
        path: "/admin/Distributorship",
        icon: <Network size={18} />,
      },
      {
        name: "Media & Report",
        path: "/admin/media&reports",
        icon: <RepeatIcon size={18} />,
      },
      { name: "Deals", path: "/admin/deals", icon: <Video size={18} /> },
      { name: "News", path: "/admin/news", icon: <Video size={18} /> },
    ];

    const EnquiryMenu = [
      {
        name: "Contact Enquiry",
        path: "/admin/contact-queries",
        icon: <Mail size={16} />,
      },
      {
        name: "Request CallBack Enquiry",
        path: "/admin/req-queries",
        icon: <PhoneCall size={16} />,
      },
    ];

    const productMenu = [
      {
        name: "Create Product",
        path: "/admin/create-product",
        icon: <FiPlusCircle size={16} />,
      },
      {
        name: "View Products",
        path: "/admin/products",
        icon: <FiShoppingBag size={16} />,
      },
      {
        name: "Add Tab",
        path: "/admin/tab/add-tab",
        icon: <FiPlusCircle size={16} />,
      },
      {
        name: "View Tabs",
        path: "/admin/tab/view-tabs",
        icon: <FiShoppingBag size={16} />,
      },
    ];

    const whyChooseMenu = [
      {
        name: "Features",
        path: "/admin/why-choose/feature",
        icon: <FiPlusCircle size={16} />,
      },
      {
        name: "Advantages",
        path: "/admin/why-choose/advantage",
        icon: <FiShoppingBag size={16} />,
      },
    ];

    return { dashboard, mainMenu, EnquiryMenu, productMenu, whyChooseMenu };
  }, []);

  const toggleMenu = useCallback((menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  }, []);

  const activePaths = useMemo(() => ({
    products: menuData.productMenu.some(item => pathname === item.path),
    enquiry: menuData.EnquiryMenu.some(item => pathname === item.path),
    whyChoose: menuData.whyChooseMenu.some(item => pathname === item.path),
  }), [pathname, menuData]);

  const MenuItem = useCallback(({ item, isSubItem = false }) => (
    <Link
      href={item.path}
      className={`flex items-center p-${isSubItem ? 2 : 3} rounded-lg transition-colors ${
        pathname === item.path
          ? "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-white"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      }`}
      onClick={onClose}
    >
      <span className={`mr-${isSubItem ? 2 : 3}`}>{item.icon}</span>
      <span className={isSubItem ? "text-sm" : ""}>{item.name}</span>
    </Link>
  ), [pathname, onClose]);

  const DropdownMenu = useCallback(({ 
    menuKey, 
    title, 
    icon, 
    items, 
    isExpanded, 
    isActive 
  }) => (
    <div className="mt-2">
      <button
        onClick={() => toggleMenu(menuKey)}
        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
          isActive
            ? "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-white"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-3">{title}</span>
        </div>
        {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="ml-8 mt-1 space-y-1">
          {items.map((item) => (
            <MenuItem key={item.path} item={item} isSubItem={true} />
          ))}
        </div>
      )}
    </div>
  ), [toggleMenu, MenuItem]);

  return (
    <>

      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden'
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-40 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className='h-full flex flex-col p-4 overflow-y-auto'>
          <h2 className='text-xl font-bold mb-8 p-2 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white'>
            Admin Panel
          </h2>

          <nav className='flex-1 space-y-1'>
            <MenuItem item={menuData.dashboard} />

            <DropdownMenu
              menuKey="products"
              title="Products"
              icon={<FiShoppingBag size={18} />}
              items={menuData.productMenu}
              isExpanded={expandedMenus.products}
              isActive={activePaths.products}
            />

            <DropdownMenu
              menuKey="enquiry"
              title="Enquiry"
              icon={<BarChart2 size={18} />}
              items={menuData.EnquiryMenu}
              isExpanded={expandedMenus.enquiry}
              isActive={activePaths.enquiry}
            />

            {menuData.mainMenu.map((item) => (
              <MenuItem key={item.path} item={item} />
            ))}

            <DropdownMenu
              menuKey="whyChoose"
              title="Why Choose Us"
              icon={<Medal size={18} />}
              items={menuData.whyChooseMenu}
              isExpanded={expandedMenus.whyChoose}
              isActive={activePaths.whyChoose}
            />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;