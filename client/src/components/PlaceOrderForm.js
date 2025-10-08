"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouteHistory } from "@/context/RouteContext";
import Image from "next/image";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getOTPLogin,
  getOTP,
  registerUser,
  loginUser,
} from "@/redux/slices/authSlice";
import { addAddress } from "@/redux/slices/addressSlice";
import axios from "@/lib/api";
import { useRouter } from "next/navigation";

const PlaceOrderForm = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const { setShowPlaceOrder } = useRouteHistory();
  const dispatch = useDispatch();
  const otpRef = useRef(null);

  const [OTPNumber, setOTPNumber] = useState("");
  const [inputOTP, setInputOTP] = useState("");
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState(""); // "success" | "error" | ""

  const [loginForm, setLoginForm] = useState({
    name: "",
    phone: "",
    street: "",
    PIN: "",
    CITY: "",
    state: "",
  });

  const [showDealOfTheDay, setShowDealOfTheDay] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const redirectRoute = localStorage.getItem("redirectAfterLogin");
    if (redirectRoute) {
      const parsedDeal = JSON.parse(redirectRoute);
      setShowDealOfTheDay(parsedDeal);
    }
  }, []);

  const itemsToShow = [
    {
      title: showDealOfTheDay.title,
      price: showDealOfTheDay.price,
      quantity: showDealOfTheDay.quantity,
      subtitle: showDealOfTheDay.subtitle,
      product: showDealOfTheDay.productId,
    },
  ];

  // ✅ Generate or resend OTP
  const handleGenerateOrResendOTP = async () => {
    const { name, phone } = loginForm;
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (phone.trim().length !== 10 || isNaN(phone.trim())) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await dispatch(getOTPLogin({ phone })).unwrap();
      if (result?.success) {
        toast.success("OTP sent successfully!");
        setOTPNumber(result?.Data);
        setIsGenerated(true);
      } else {
        toast.error(result?.message || "Login failed, trying registration...");
        throw new Error("Try register");
      }
    } catch (err) {
      if (
        err == "User not registered with this number" ||
        err.message === "Try register"
      ) {
        const regRes = await dispatch(
          getOTP({ firstName: name, mobileNumber: phone })
        ).unwrap();
        if (regRes?.success) {
          toast.success("User registered and OTP sent!");
          setOTPNumber(regRes?.Data);
          setIsGenerated(true);
        } else {
          toast.error("Registration failed");
        }
      } else {
        toast.error("Failed to generate OTP");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Confirm OTP
  const handleConfirmOTP = async () => {
    if (inputOTP.trim() === "") {
      toast.error("Please enter OTP");
      return;
    }

    if (inputOTP != OTPNumber) {
      toast.error("Invalid OTP");
      setOtpStatus("error");
      otpRef.current?.focus();
      return;
    }

    const { name, phone } = loginForm;
    try {
      const res = await dispatch(loginUser({ loginForm })).unwrap();
      if (res?.success) {
        toast.success("OTP verified successfully!");
        setIsOTPVerified(true);
        setOtpStatus("success");
      }
    } catch (err) {
      if (err == "User not found") {
        const regRes = await dispatch(
          registerUser({ firstName: name, mobileNumber: phone })
        ).unwrap();
        if (regRes?.success) {
          toast.success("Registered and OTP verified successfully!");
          setIsOTPVerified(true);
          setOtpStatus("success");
        }
      } else {
        toast.error("Verification failed");
        setOtpStatus("error");
        otpRef.current?.focus();
      }
    }
  };

  // ✅ Payment functions
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async ({ amount, user, onSuccess, addressId }) => {
    const isSDKLoaded = await loadRazorpayScript();
    if (!isSDKLoaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const { data } = await axios.post("/payment/order", {
        amount,
        items: itemsToShow,
        addressId,
        note: "",
        type: "viewPlan",
      });

      const options = {
        key: "rzp_test_RNVfuvBSKZ0E85",
        amount: data.order.amount,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              addressId,
              note: "",
              productSet: itemsToShow,
              type: "viewPlan",
            });

            if (verifyRes.data.success) {
              onSuccess(verifyRes.data.orderId);
              setShowPlaceOrder(false);
            } else {
              alert("Payment verification failed.");
            }
          } catch {
            alert("Payment verification failed.");
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong during payment");
    }
  };

  // ✅ Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isOTPVerified) {
      toast.error("Please verify OTP first");
      return;
    }

    const { name, phone, street, PIN, CITY, state } = loginForm;
    if (!name || !phone || !street || !PIN || !CITY || !state) {
      toast.error("Please fill all address fields");
      return;
    }

    try {
      const res = await dispatch(
        addAddress({
          fullName: name,
          phone,
          street,
          city: CITY,
          state,
          zipCode: PIN,
          country: "India",
          isDefault: true,
        })
      ).unwrap();

      if (res?.success) {
        toast.success("Address added successfully!");
        const addressId = res.address?._id;

        await handlePayment({
          amount: showDealOfTheDay.price * 100,
          user,
          onSuccess: (orderId) => router.push(`/orderConfirmation/${orderId}`),
          addressId,
        });
      }
    } catch {
      toast.error("Order failed");
    }
  };

  // ✅ Enable Place Order only if OTP verified + all address filled
  const isFormComplete =
    isOTPVerified &&
    loginForm.name &&
    loginForm.phone &&
    loginForm.street &&
    loginForm.PIN &&
    loginForm.CITY &&
    loginForm.state;

  const resendOTP = async () => {
    console.log("bnm");

    const { phone } = loginForm;
    console.log(phone);
    console.log(OTPNumber);

    try {
      const res = await axios.post("/getOTP/resend", {
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
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => setShowPlaceOrder(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ❌
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Place Your Order
        </h2>

        {/* Product Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-32 h-32">
            <Image
              src={showDealOfTheDay?.image || "/fallback.png"}
              alt={showDealOfTheDay?.title || "Deal"}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{showDealOfTheDay?.title}</h3>
            <p className="text-gray-600">₹{showDealOfTheDay?.price}</p>
            <p className="text-gray-600">
              Qty: {showDealOfTheDay?.quantity || 1}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handlePlaceOrder}>
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded-lg"
            value={loginForm.name}
            onChange={(e) =>
              setLoginForm({ ...loginForm, name: e.target.value })
            }
          />

          {/* Phone with Generate/Resend button */}
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Phone Number"
              inputMode="numeric"
              pattern="[0-9]*"
              className="flex-1 border px-3 py-2 rounded-lg"
              maxLength={10}
              value={loginForm.phone}
              onChange={(e) =>
                setLoginForm({ ...loginForm, phone: e.target.value })
              }
            />
            <button
              type="button"
              onClick={isGenerated ? resendOTP : handleGenerateOrResendOTP}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 whitespace-nowrap"
              disabled={isGenerating}
            >
              {isGenerated ? "Resend OTP" : "Get OTP"}
            </button>
          </div>

          {/* OTP with Confirm button */}
          <div className="flex gap-2">
            <input
              ref={otpRef}
              type="number"
              placeholder="Enter OTP"
              value={inputOTP}
              className={`flex-1 border px-3 py-2 rounded-lg focus:outline-none ${
                otpStatus === "success"
                  ? "border-green-500"
                  : otpStatus === "error"
                  ? "border-red-500"
                  : ""
              }`}
              onChange={(e) => setInputOTP(e.target.value)}
            />
            <button
              type="button"
              onClick={handleConfirmOTP}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
            >
              Confirm
            </button>
          </div>

          {/* Address Fields */}
          <input
            type="text"
            placeholder="Street"
            className="w-full border px-3 py-2 rounded-lg"
            value={loginForm.street}
            onChange={(e) =>
              setLoginForm({ ...loginForm, street: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="PIN Code"
            className="w-full border px-3 py-2 rounded-lg"
            value={loginForm.PIN}
            onChange={(e) =>
              setLoginForm({ ...loginForm, PIN: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            className="w-full border px-3 py-2 rounded-lg"
            value={loginForm.CITY}
            onChange={(e) =>
              setLoginForm({ ...loginForm, CITY: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            className="w-full border px-3 py-2 rounded-lg"
            value={loginForm.state}
            onChange={(e) =>
              setLoginForm({ ...loginForm, state: e.target.value })
            }
          />

          {/* Place Order Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white text-lg ${
              isFormComplete
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormComplete}
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderForm;
