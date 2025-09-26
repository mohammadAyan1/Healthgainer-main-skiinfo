import { useEffect, useState, useRef, useCallback } from "react";
import { FaBell } from "react-icons/fa";

const OrderNotifications = () => {
  const [newOrders, setNewOrders] = useState([]);
  const eventSourceRef = useRef(null);
  const handleMessage = useCallback((event) => {
    console.log("🎯 SSE Event Received:", event.data);

    if (event.data !== "{}") {
      const newOrder = JSON.parse(event.data);
      setNewOrders(prev => [...prev, newOrder]);
      alert("🎉 New Order Arrived!");
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error("❌ SSE Connection Error:", error);
  }, []);

  useEffect(() => {
    if (eventSourceRef.current) return;

    const eventSource = new EventSource(
      "https://healthgainer-main.onrender.com/api/v1/orders/notifications"
    );
    
    eventSourceRef.current = eventSource;

    eventSource.onmessage = handleMessage;
    eventSource.onerror = handleError;

    return () => {
      console.log("Closing SSE Connection...");
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [handleMessage, handleError]);

  const badgeContent = newOrders.length > 0 ? newOrders.length : "0";

  return (
    <div>
      <button className="p-1 rounded-full hover:bg-gray-100 relative">
        <FaBell className="text-gray-500 h-6 w-6" />
        <span className="absolute top-0 right-0 left-4 h-5 w-5 p-1 text-white rounded-full bg-red-500 flex items-center justify-center">
          {badgeContent}
        </span>
      </button>
    </div>
  );
};

export default OrderNotifications;