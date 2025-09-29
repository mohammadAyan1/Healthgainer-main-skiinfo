import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/redux/actions/orderActions";

const CheckoutButton = ({ total, orderData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = async () => {
    if (window.Razorpay) return true;

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "rzp-script";
      script.async = true;

      script.onload = () => {
        
        resolve(true);
      };

      script.onerror = () => {
        console.warn("Primary CDN failed, trying fallback");
        const fallback = document.createElement("script");
        fallback.src = "https://cdn.razorpay.com/static/v1/checkout.js";
        fallback.onload = () => resolve(true);
        fallback.onerror = () => resolve(false);
        document.body.appendChild(fallback);
      };

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Payment system unavailable");

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error("Payment configuration missing");
      }

      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
      const createOrderURL = `${baseURL}/payment/create-order`;
      
      

      const { data } = await axios.post(createOrderURL, {
        amount: total
      }).catch(err => {
        console.error("Order creation failed:", {
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        throw err;
      });

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Your Business",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyURL = `${baseURL}/payment/verify`;
            const verifyRes = await axios.post(verifyURL, {
              order_id: data.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              const action = await dispatch(placeOrder({
                ...orderData,
                paymentInfo: response
              }));
              router.push(`/order-success/${action.payload._id}`);
            } else {
              alert("Payment failed verification");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            alert("Payment verification failed");
          }
        },
        theme: { color: "#3399cc" }
      });

      rzp.open();
      
    } catch (err) {
      console.error("Payment error:", {
        message: err.message,
        response: err.response?.data
      });
      alert(err.response?.data?.error || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className={`payment-button ${isProcessing ? 'processing' : ''}`}
    >
      {isProcessing ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default CheckoutButton;