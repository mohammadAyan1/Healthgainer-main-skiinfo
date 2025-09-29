"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allOrders, updateOrderStatus } from "@/redux/slices/orderSlice";

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const ExportIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-600",
  Pending: "bg-yellow-100 text-yellow-600", 
  Shipped: "bg-blue-100 text-blue-600",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-600"
};

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state?.orders?.orders || []);
  const { loading, error } = useSelector((state) => state?.orders || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(allOrders());
  }, [dispatch]);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const query = searchQuery.toLowerCase();
      return (
        order?.userId?.firstName?.toLowerCase().includes(query) ||
        order?._id?.toString().includes(query) ||
        order?.status?.toLowerCase().includes(query)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = sortConfig.key.includes('.') 
          ? sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a)
          : a[sortConfig.key];
        const bVal = sortConfig.key.includes('.') 
          ? sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b)
          : b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [orders, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredAndSortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  }, []);

  const handleViewOrder = useCallback((order) => {
    setSelectedOrder(order);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus }));
      dispatch(allOrders());
    } catch (error) {
      
    }
  }, [dispatch]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <SpinnerIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => dispatch(allOrders())}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </div>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors w-full md:w-auto">
          <ExportIcon />
          Export
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              {[
                { key: "orderNumber", label: "Order Number" },
                { key: "_id", label: "Order ID" },
                { key: "userId.firstName", label: "Customer" },
                { key: "totalAmount", label: "Total" },
                { key: "status", label: "Status" }
              ].map(({ key, label }) => (
                <th key={key} className="p-3 text-left cursor-pointer" onClick={() => handleSort(key)}>
                  <div className="flex items-center">
                    {label} <SortIcon />
                  </div>
                </th>
              ))}
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">{order.orderNumber}</td>
                  <td className="p-3">{order.orderId}</td>
                  <td className="p-3">{`${order?.userId?.firstName || ""} ${order?.userId?.lastName || ""}`.trim()}</td>
                  <td className="p-3">₹{order.totalAmount}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-sm ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="bg-black text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition-colors"
                    >
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 p-1">
                <CloseIcon />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.userId.firstName} {selectedOrder.userId.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.userId.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.userId.mobileNumber}</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => {
                      const variant = item?.productId?.variants?.find((v) => v._id === item.variantId);
                      return (
                        <div key={item._id} className="border p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                            <p><span className="font-medium">Product:</span> {item?.productId?.name}</p>
                            <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                            <p><span className="font-medium">Price:</span> ₹{item.price}</p>
                            <p><span className="font-medium">Weight:</span> {variant?.weight}</p>
                          </div>
                          {variant?.images?.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {variant.images.slice(0, 4).map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Variant ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded"
                                  loading="lazy"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <p><span className="font-medium">Total Amount:</span> ₹{selectedOrder.totalAmount}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus}</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><span className="font-medium">Full Name:</span> {selectedOrder.address.fullName}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.address.phone}</p>
                    <p><span className="font-medium">Street:</span> {selectedOrder.address.street}</p>
                    <p><span className="font-medium">City:</span> {selectedOrder.address.city}</p>
                    <p><span className="font-medium">State:</span> {selectedOrder.address.state}</p>
                    <p><span className="font-medium">Zip Code:</span> {selectedOrder.address.zipCode}</p>
                    <p><span className="font-medium">Country:</span> {selectedOrder.address.country}</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Order Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[selectedOrder.status] || "bg-gray-100 text-gray-600"}`}>
                    {selectedOrder.status}
                  </span>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}