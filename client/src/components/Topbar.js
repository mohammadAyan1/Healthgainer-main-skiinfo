'use client';

import { FaSkype, FaYoutube, FaFacebookF, FaTwitter, FaInstagram, FaSearch } from 'react-icons/fa';
import { MdAccountCircle, MdPhone, MdHelpOutline } from 'react-icons/md';

export default function TopBar() {
    return (
        <div className="bg-primary text-white py-2 p-2 flex flex-wrap items-center justify-between">
            {/* Left: Social Icons */}
            <div className="flex items-center font-xl space-x-6">
                <FaSkype className="cursor-pointer hover:opacity-80" />
                <FaYoutube className="cursor-pointer hover:opacity-80" />
                <FaFacebookF className="cursor-pointer hover:opacity-80" />
                <FaTwitter className="cursor-pointer hover:opacity-80" />
                <FaInstagram className="cursor-pointer hover:opacity-80" />
            </div>

            {/* Right: Account, Help, Phone, Search */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">

                        <MdAccountCircle className='text-2xl  text-black' />
                    </div>
                    <span className="hidden sm:inline">Account Log In</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">

                        <MdHelpOutline className='text-2xl  text-black' />
                    </div>

                    <span className="hidden sm:inline">Ask Your Question</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">

                        <MdPhone className='text-xl  text-black' />
                    </div>
                    
                    <span className="hidden sm:inline">+001 142 1426</span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">

                        <FaSearch className='text-xl  text-black cursor-pointer hover:opacity-80' />
                    </div>
               
            </div>
        </div>
    );
}
