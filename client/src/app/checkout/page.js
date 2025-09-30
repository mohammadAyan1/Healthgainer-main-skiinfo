"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAddresses } from "@/redux/slices/addressSlice";
import { Loader2 } from "lucide-react";
import AddressSection from "@/components/AddressSection";
import axios from "@/lib/api";

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);

  const { addresses, loading, error } = useSelector(
    (state) => state.address || []
  );

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const searchParams = useSearchParams();
  const checkoutType = searchParams.get("type");
  const planTitle = searchParams.get("title");
  const quantity = Number(searchParams.get("quantity"));
  const subtitle = searchParams.get("subtitle");
  const productId = searchParams.get("productId");
  const planAmountParam = searchParams.get("amount") || "0";

  const PlanAmount = Number(planAmountParam.replace(/[^0-9]/g, ""));
  const isViewPlan = checkoutType === "viewPlan";

  const itemsToShow = isViewPlan
    ? [
        {
          title: planTitle,
          price: PlanAmount,
          quantity: quantity,
          subtitle: subtitle,
          product: productId,
        },
      ]
    : cartItems;

  console.log(itemsToShow);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (!isViewPlan && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router, isViewPlan]);

  const subtotal = isViewPlan
    ? PlanAmount
    : cartItems.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0
      );

  const total = isViewPlan ? PlanAmount : subtotal - couponDiscount;

  const handleApplyCoupon = () => {
    if (coupon === "SAVE10") {
      setCouponDiscount(subtotal * 0.1);
      setCouponApplied(true);
    } else {
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

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
        addressId: selectedAddress._id,
        note: orderNote,
        type: isViewPlan ? "viewPlan" : "cart",
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
              addressId: selectedAddress._id,
              note: orderNote,
              productSet: itemsToShow,
              type: isViewPlan ? "viewPlan" : "cart",
            });

            console.log(verifyRes);

            if (verifyRes.data.success) {
              onSuccess(verifyRes.data.orderId);
            } else {
              alert("Payment verification failed. Order not created.");
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

  const handlePlaceOrder = async () => {
    console.log(selectedAddress);

    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }
    console.log("sdfghjkl");

    if (!addressSelected) {
      alert("Please select a shipping address");
      return;
    }

    try {
      setLoadingPayment(true);
      await handlePayment({
        amount: total * 100,
        user,
        onSuccess: (orderId) => {
          console.log(orderId);
          router.push(`/orderConfirmation/${orderId}`);
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AddressSection
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              setAddressSelected={setAddressSelected}
              addressSelected={addressSelected}
            />

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Order Note (Optional)
              </h2>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Any special instructions for your order..."
                className="w-full p-3 border rounded focus:ring-1 focus:ring-primary"
                rows="3"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                {itemsToShow.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b pb-4">
                    {!isViewPlan && (
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {isViewPlan ? item.title : item.name}
                      </p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                      <p className="text-sm">
                        {isViewPlan ? `SubTitle: ${item.subtitle}` : ""}
                      </p>
                      <p className="font-medium">
                        ₹
                        {isViewPlan
                          ? PlanAmount.toFixed(2)
                          : (item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Price Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Subtotal:</p>
                    <p>₹{subtotal.toFixed(2)}</p>
                  </div>
                  {!isViewPlan && couponApplied && (
                    <div className="flex justify-between">
                      <p>Coupon Discount:</p>
                      <p className="text-green-600">
                        -₹{couponDiscount.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <p>Total Amount:</p>
                    <p>₹{total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || loadingPayment}
                className={`w-full mt-6 py-3 rounded-lg text-lg font-medium flex items-center justify-center transition ${
                  selectedAddress && !loadingPayment
                    ? "bg-primary text-white hover:bg-secondary"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loadingPayment && (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                )}
                {!selectedAddress
                  ? "Please Add the address"
                  : loadingPayment
                  ? "Processing..."
                  : "Pay & Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
