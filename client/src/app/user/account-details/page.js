"use client";
import  { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserDetails} from "@/redux/slices/authSlice";
import { toast } from "react-toastify";  

export default function AccountDetails() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  

  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (userDetails) {
      const parsedUser = JSON.parse(userDetails);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        mobileNumber: parsedUser.mobileNumber || "",
        email: parsedUser.email || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUserData = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
    };

    dispatch(updateUserDetails(updatedUserData));

    localStorage.setItem("user", JSON.stringify(updatedUserData));

    toast.success("User details updated successfully!");
  };

  if (!user) {
    return <div className="text-center py-10">Loading...</div>;
  }
  

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg px-8 py-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Details</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 col-span-2">
            <label className="block text-gray-600 text-sm mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full border border-primary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full border border-primary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-2">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              className="w-full border border-primary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="w-full border border-primary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-white rounded-lg px-6 py-3 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
  }
  