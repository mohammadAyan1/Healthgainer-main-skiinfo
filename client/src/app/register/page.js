"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, getOTP } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import API from "@/lib/api";

export default function RegisterPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hideForm, setHideForm] = useState(false);
  const [getOtp, setGetOtp] = useState(null);
  const [OTPNumber, setOTPNumber] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const resendOTP = async () => {
    const res = await API.post("/getOTP/resend", {
      phone: registerForm.mobileNumber,
      OTPNumber,
    });
    if (res?.data?.status) {
      toast.success("OTP resend to you number again please check your SMS.");
      setOTPNumber(res?.data?.Data);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      confirmPassword,
    } = registerForm;

    if (!firstName.trim() || !mobileNumber.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (mobileNumber.trim().length !== 10 || isNaN(mobileNumber.trim())) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    setIsLoading(true);
    dispatch(getOTP({ firstName, lastName, email, mobileNumber, password }))
      .unwrap()
      .then((res) => {
        console.log(res);

        if (res?.success) {
          setHideForm(true);
          setOTPNumber(res?.Data);
        }

        toast.success("OTP generated successfull");
        // router.push("/login");
      })
      .catch((err) => {
        toast.error(err || "Registration failed");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmOTP = () => {
    try {
      const {
        firstName,
        lastName,
        email,
        mobileNumber,
        password,
        confirmPassword,
      } = registerForm;

      if (OTPNumber == getOtp) {
        setIsLoading(true);
        dispatch(
          registerUser({ firstName, lastName, email, mobileNumber, password })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast.success("Registration Successful! Please log in.");
              router.push("/login");
            }
          });
      } else {
        toast.error("Wrong OTP");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Create Account
              </h1>
              <p className="text-gray-600 mt-2">Join our community today</p>
            </div>
            {hideForm ? (
              <div className="flex flex-col justify-center items-center">
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Enter the OTP"
                    onChange={(e) => setGetOtp(e.target.value)}
                    className="p-2 w-"
                  />
                </div>
                <div className="flex gap-1">
                  <div>
                    <button
                      className="bg-green-700 p-2 text-white"
                      onClick={confirmOTP}
                    >
                      Confirm OTP
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={resendOTP}
                      className="bg-blue-700 text-white p-2"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="John"
                        value={registerForm.firstName}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="optional"
                        value={registerForm.lastName}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            lastName: e.target.value,
                          })
                        }
                        // required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="your@email.com"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="mobileNumber"
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter your mobile number"
                      value={registerForm.mobileNumber}
                      maxLength={10}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          mobileNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 mt-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </motion.button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 text-center">
            <p className="text-gray-600 text-sm">
              By registering, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
