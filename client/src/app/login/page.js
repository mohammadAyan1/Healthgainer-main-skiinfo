"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getOTPLogin, loginUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import API from "@/lib/api";
import { updateCartGuestIdToUserId } from "@/redux/slices/cartSlice";

import { useRouteHistory } from "@/context/RouteContext";

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { previousPath, currentPath } = useRouteHistory();
  const [loginForm, setLoginForm] = useState({
    password: "",
    phone: "",
  });

  const inputRef = useRef(null);

  const [OtpForCheck, setOtpForCheck] = useState("");
  const [OTPNumber, setOTPNumber] = useState("");

  const [hideForm, setHideForm] = useState(false);

  // 🔑 Loading states for each button
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isConfirmingOTP, setIsConfirmingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMounted]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSigningIn(true);

    dispatch(getOTPLogin(loginForm))
      .unwrap()
      .then((result) => {
        if (result?.success) {
          setHideForm(true);
          toast.success("OTP generated successfully. Please check your SMS.");
          setOTPNumber(result?.Data);
        } else {
          console.log("qwertyuiop");

          toast.error(result?.message || "login failed");
        }
      })
      .catch((err) => {
        if (err === "User not registered with this number") {
          toast.error(err);
          setTimeout(() => {
            router.push(`/register?mobile=${loginForm.phone}`);
          }, 200);
        } else {
          alert("Login Failed");
        }
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  };

  const confirmOTP = async () => {
    setIsConfirmingOTP(true);
    console.log(previousPath);
    console.log(currentPath);

    try {
      if (OTPNumber == OtpForCheck) {
        if (!loginForm.phone) {
          toast.error("Please fill in all fields");
          return;
        }

        dispatch(loginUser({ loginForm }))
          .unwrap()
          .then(async (res) => {
            if (res?.success) {
              const GuestIdCheck = localStorage.getItem("guestId");
              const UserId = res.user._id;

              if (GuestIdCheck) {
                try {
                  const result = await dispatch(
                    updateCartGuestIdToUserId({ GuestIdCheck, UserId })
                  ).unwrap();

                  console.log("Cart updated:", result);

                  // ✅ Remove guest cart id from localStorage after success
                  localStorage.removeItem("guestId");
                } catch (err) {
                  console.error("Error merging cart:", err);
                }
              }
              const redirectRoute = localStorage.getItem("redirectAfterLogin");
              toast.success("Login Successful!");
              if (previousPath == "/cart") {
                router.push("/cart");
              } else if (redirectRoute) {
                localStorage.removeItem("redirectAfterLogin"); // cleanup
                router.push(redirectRoute);
              } else router.push("/");
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setIsConfirmingOTP(false);
          });
      } else {
        toast.error("Wrong OTP");
        setIsConfirmingOTP(false);
      }
    } catch (error) {
      console.error(error);
      setIsConfirmingOTP(false);
    }
  };

  const resendOTP = async () => {
    setIsResendingOTP(true);
    try {
      const res = await API.post("/getOTP/resend", {
        phone: loginForm.phone,
        OTPNumber,
      });
      if (res?.status) {
        toast.success("OTP resent successfully. Please check your SMS.");
        setOTPNumber(res?.data?.Data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsResendingOTP(false);
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
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            {!hideForm ? (
              <form onSubmit={handleLogin}>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      ref={inputRef}
                      id="phone"
                      type="tel"
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter Phone Number"
                      value={loginForm.phone}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? (
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
                        Number Verify...
                      </span>
                    ) : (
                      " LOGIN WITH OTP"
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <div>
                <div>
                  <input
                    onChange={(e) => setOtpForCheck(e.target.value)}
                    type="text"
                    placeholder="Enter OTP here"
                    className="border rounded p-2 mb-2 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={confirmOTP}
                    disabled={isConfirmingOTP}
                    className="flex-1 bg-green-700 text-white p-2 rounded-md flex items-center justify-center"
                  >
                    {isConfirmingOTP ? "Confirming..." : "Confirm OTP"}
                  </button>
                  <button
                    onClick={resendOTP}
                    disabled={isResendingOTP}
                    className="flex-1 bg-blue-700 text-white p-2 rounded-md flex items-center justify-center"
                  >
                    {isResendingOTP ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 text-center">
            <p className="text-gray-600 text-sm">
              By continuing, you agree to our{" "}
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
