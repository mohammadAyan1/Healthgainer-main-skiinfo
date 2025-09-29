"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  FiEdit,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    

    if (storedUser) {
      setUserData(JSON.parse(storedUser) );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    
    const updatedUser = { ...userData, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    

    setUserData(updatedUser);
    setIsEditing(false);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-8 text-center relative">
              <div className="relative -mt-16 mx-auto w-32 h-32">
                <img
                  src="https://avatar.iran.liara.run/public/boy"
                  alt="Profile"
                  className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="w-1/2 pr-2">
                  <div className="bg-gray-200 h-4 rounded-full w-1/2"></div>
                </div>
                <div className="w-1/2 pl-2">
                  <div className="bg-gray-200 h-4 rounded-full w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-1/2 pr-2">
                  <div className="bg-gray-200 h-4 rounded-full w-1/2"></div>
                </div>
                <div className="w-1/2 pl-2">
                  <div className="bg-gray-200 h-4 rounded-full w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2 pr-2">
                  <div className="bg-gray-200 h-4 rounded-full w-1/2"></div>
                </div>
                <div className="w-1/2 pl-2">
                  <div className="bg-gray-200 h-4 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { profilePhoto, email, mobileNumber, firstName, lastName, createdAt } =
    userData;
  const joinDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 md:px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-8 text-center relative">
            <div className="relative mx-auto w-32 h-32">
              <img
                src={profilePhoto || "https://avatar.iran.liara.run/public/boy"}
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-white/20 backdrop-blur-sm text-white font-bold px-3 py-1 rounded-md w-full max-w-[120px] text-center placeholder-white/70"
                    placeholder="First name"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-white/20 backdrop-blur-sm text-white font-bold px-3 py-1 rounded-md w-full max-w-[120px] text-center placeholder-white/70"
                    placeholder="Last name"
                  />
                </div>
              ) : (
                `${firstName} ${lastName}`
              )}
            </h1>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <FiMail size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>

                  <p className="text-gray-900">{email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <FiPhone size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>

                  <p className="text-gray-900">{mobileNumber}</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <FiCalendar size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Member Since
                  </h3>
                  <p className="text-gray-900">{joinDate}</p>
                </div>
              </div>

              {/* Addresses */}
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <FiMapPin size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Addresses
                  </h3>
                  {userData.addresses && userData.addresses.length > 0 ? (
                    <p className="text-gray-900">
                      {userData.addresses.length} saved addresses
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No addresses saved</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
