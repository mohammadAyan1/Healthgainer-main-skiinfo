"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { updateCartGuestIdToUserId } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";

import { addAddress } from "@/redux/slices/addressSlice";
import axios from "@/lib/api";

const PlaceOrderForm = () => {
  const user = useSelector((state) => state.auth.user);

  const router = useRouter();

  const { setShowPlaceOrder } = useRouteHistory();
  const dispatch = useDispatch();
  const [OTPNumber, setOTPNumber] = useState("");
  const [selectFn, setSelectFn] = useState(false);
  const [register, setRegister] = useState({});
  const [address, setAddress] = useState(null);

  const initial = {
    createdAt: "",
    image: "",
    price: "",
    quantity: "",
    sno: "",
    subtitle: "",
    tag: "",
    title: "",
    type: "",
    updatedAt: "",
    _id: "",
  };

  const [loginForm, setLoginForm] = useState({
    name: "",
    phone: "",
    street: "",
    PIN: "",
    CITY: "",
    state: "",
  });

  const [showDealOfTheDay, setShowDealOfTheDay] = useState(initial);

  useEffect(() => {
    const redirectRoute = localStorage.getItem("redirectAfterLogin");
    if (redirectRoute) {
      const parsedDeal = JSON.parse(redirectRoute);
      setShowDealOfTheDay(parsedDeal);
    }
  }, []);

  console.log(showDealOfTheDay);

  const itemsToShow = [
    {
      title: showDealOfTheDay.title,
      price: showDealOfTheDay.price,
      quantity: showDealOfTheDay.quantity,
      subtitle: showDealOfTheDay.subtitle,
      product: showDealOfTheDay.productId,
    },
  ];

  console.log(itemsToShow);

  // Debounce helper
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // Always use latest value by passing the phone explicitly
  const handleGenerateOTP = async (currentLoginForm) => {
    setRegister(currentLoginForm);
    if (!currentLoginForm.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log(currentLoginForm, "current loginForm");

    dispatch(getOTPLogin(currentLoginForm))
      .unwrap()
      .then((result) => {
        if (result?.success) {
          toast.success("OTP generated successfully. Please check your SMS.");
          setSelectFn(true);
          setOTPNumber(result?.Data);
        } else {
          toast.error(result?.message || "login failed");
        }
      })
      .catch((err) => {
        if (err === "User not registered with this number") {
          const { name, phone } = currentLoginForm;
          console.log(name);
          console.log(phone);

          console.log("asdfghjkl");

          if (!name.trim() || !phone.trim()) {
            toast.error("Please fill in all fields");
            return;
          }

          if (phone.trim().length !== 10 || isNaN(phone.trim())) {
            toast.error("Mobile number must be 10 digits");
            return;
          }

          dispatch(getOTP({ firstName: name, mobileNumber: phone }))
            .unwrap()
            .then((res) => {
              if (res?.success) {
                setOTPNumber(res?.Data);
              }

              toast.success("OTP generated successfull");
            })
            .catch((err) => {
              toast.error(err || "Registration failed");
            });
        } else {
          alert("Login Failed");
        }
      })
      .finally(() => {});
  };

  const checkOTPFunction = (inputOTP, realOTP) => {
    console.log(inputOTP);
    console.log(realOTP);

    if (inputOTP == realOTP) {
      console.log("this login function");

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

            console.log(user);
            console.log(UserId);

            console.log(loginForm);

            await dispatch(
              addAddress({
                fullName: loginForm.name,
                phone: loginForm.phone,
                street: loginForm.street,
                city: loginForm.CITY,
                state: loginForm.state,
                zipCode: loginForm.PIN,
                country: "India",
                isDefault: true,
              })
            )
              .unwrap()
              .then(async (res) => {
                if (res?.success) {
                  console.log(res);
                  setAddress(res.address?._id);

                  toast.success("address added success full");
                  setTimeout(() => {
                    toast.warn("Order will be shipped on this address");
                  }, 300);
                }
              });

            toast.success("OTP Configuration successfull!");
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {});
    } else {
      toast.error("Wrong OTP !");
    }
  };

  const confirmOTP = async (inputOTP, realOTP) => {
    try {
      console.log(inputOTP);
      console.log(realOTP);

      console.log("this is registration form");

      if (inputOTP == realOTP) {
        const { name, phone } = loginForm;
        console.log(loginForm);

        dispatch(registerUser({ firstName: name, mobileNumber: phone }))
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
                  // updateAddress({ id: currentAddress._id, ...currentAddress });
                } catch (err) {
                  console.error("Error merging cart:", err);
                }
              }

              await dispatch(
                addAddress({
                  fullName: loginForm.name,
                  phone: loginForm.phone,
                  street: loginForm.street,
                  city: loginForm.CITY,
                  state: loginForm.state,
                  zipCode: loginForm.PIN,
                  country: "India",
                  isDefault: true,
                })
              )
                .unwrap()
                .then(async (res) => {
                  if (res?.success) {
                    console.log(res);
                    setAddress(res.address?._id);

                    toast.success("address added success full");
                    setTimeout(() => {
                      toast.warn("Order will be shipped on this address");
                    }, 300);
                  }
                });
              toast.success("OTP Configuration successfull!");
            }
          });
      } else {
        toast.error("Wrong OTP");
      }
    } catch (error) {
    } finally {
    }
  };

  // Create debounced versions
  const debouncedGenerateOTP = useCallback(
    debounce(handleGenerateOTP, 1000),
    []
  );
  const debouncedConfirmOTP = useCallback(
    debounce(selectFn ? checkOTPFunction : confirmOTP, 1000),
    [selectFn]
  );

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async ({ amount, user, onSuccess }) => {
    const isSDKLoaded = await loadRazorpayScript();
    if (!isSDKLoaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const { data } = await axios.post("/payment/order", {
        amount,
        items: itemsToShow,
        addressId: address,
        note: "",
        type: "viewPlan",
      });

      console.log(data);

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
              addressId: address,
              note: "",
              productSet: itemsToShow,
              type: "viewPlan",
            });

            console.log(verifyRes);

            if (verifyRes.data.success) {
              onSuccess(verifyRes.data.orderId);
              setShowPlaceOrder(false);
            } else {
              alert("Payment verification failed. Order not created. asdfghjk");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Order not created.");
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Something went wrong.");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      console.log(user, "qwertyuiopasdfghjklzxcvbnm");

      await handlePayment({
        amount: showDealOfTheDay.price * 100,
        user,
        onSuccess: (orderId) => {
          console.log(orderId);
          router.push(`/orderConfirmation/${orderId}`);
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => setShowPlaceOrder(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ❌
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Place Your Order
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src={showDealOfTheDay?.image || "/fallback.png"}
              alt={showDealOfTheDay?.title || "Deal"}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-lg">{showDealOfTheDay?.title}</h3>
            <p className="text-gray-600">
              Subtitle: {showDealOfTheDay?.subtitle}
            </p>
            <p className="text-gray-600">Price: {showDealOfTheDay?.price}</p>
            <p className="text-gray-600">
              Quantity: {showDealOfTheDay?.quantity}
            </p>
          </div>
        </div>

        <form className="space-y-4">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={loginForm.name}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                onChange={(e) =>
                  setLoginForm((prev) => {
                    const updated = { ...prev, name: e.target.value };
                    debouncedGenerateOTP(updated); // Pass the latest form
                    return updated;
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={loginForm.phone}
                placeholder="Enter phone number"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                onChange={(e) =>
                  setLoginForm((prev) => {
                    const updated = { ...prev, phone: e.target.value };
                    debouncedGenerateOTP(updated); // Pass latest form
                    return updated;
                  })
                }
              />
            </div>
          </div>

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              OTP Verification
            </label>
            <input
              type="number"
              placeholder="Enter OTP"
              maxLength={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              onChange={(e) => debouncedConfirmOTP(e.target.value, OTPNumber)}
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["street", "PIN", "CITY", "state"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field === "PIN"
                    ? "PIN Code"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  value={loginForm[field]}
                  placeholder={`Enter ${field}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  onChange={(e) =>
                    setLoginForm((prev) => {
                      const updated = {
                        ...prev,
                        [field]: e.target.value,
                      };
                      debouncedGenerateOTP(updated);
                      return updated;
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all text-lg"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderForm;
