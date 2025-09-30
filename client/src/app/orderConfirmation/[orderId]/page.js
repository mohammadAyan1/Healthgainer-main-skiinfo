// "use client";

// import { useEffect, useState, use } from "react";
// import { useRouter } from "next/navigation";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import API from "@/lib/api";
// import {
//   Download,
//   ArrowLeft,
//   Loader2,
//   Home,
//   Phone,
//   Mail,
//   Clock,
// } from "lucide-react";

// export default function OrderConfirmationPage({ params }) {
//   const { orderId } = use(params);
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [downloading, setDownloading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await API.get(`/orders/${orderId}`);
//         const data = response.data;
//         console.log(response);

//         if (!data.success) throw new Error("Order not found");
//         setOrder(data.order);
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) {
//       fetchOrderDetails();
//     }
//   }, [orderId]);

//   const handleDownloadInvoice = async () => {
//     try {
//       setDownloading(true);
//       const invoiceElement = document.getElementById("invoice-section");
//       const canvas = await html2canvas(invoiceElement, {
//         scale: 2,
//         logging: false,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 190;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
//       pdf.save(`Invoice_${order._id}.pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     } finally {
//       setDownloading(false);
//     }
//   };
//   console.log(order);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString("en-IN", options);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm text-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             Order Not Found
//           </h1>
//           <p className="text-gray-600 mb-6">
//             We couldn&apos;t find the order you&apos;re looking for.
//           </p>
//           <button
//             onClick={() => router.push("/")}
//             className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-primary hover:text-secondary mb-6 transition-colors"
//         >
//           <ArrowLeft className="h-5 w-5" />
//           <span className="font-medium">Back to Orders</span>
//         </button>

//         <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
//           <div id="invoice-section" className="p-0">
//             <div className="bg-black p-6 text-white">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <div className="bg-white p-2 rounded-md">
//                       <img className="w-20" src="/logo.png" alt="logo" />
//                     </div>
//                     <div>
//                       <h1 className="text-2xl font-bold">Health Gainer</h1>
//                       <p className="text-white">Quality Healthcare Products</p>
//                     </div>
//                   </div>
//                   <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                     <div className="flex items-start gap-2">
//                       <Home className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                       <span>123 Health Street, Bhopal, MP 462001</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Phone className="h-4 w-4" />
//                       <span>+91 98765 43210</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Mail className="h-4 w-4" />
//                       <span>support@pharmascience.com</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       <span>Mon-Sat: 9AM - 7PM</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4 rounded-md">
//                   <h2 className="text-xl font-bold mb-2">INVOICE</h2>
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <span className="font-medium">Invoice #</span>
//                     <span>{order._id}</span>
//                     <span className="font-medium">Date</span>
//                     <span>{formatDate(order.createdAt)}</span>
//                     <span className="font-medium">Status</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                   Bill To
//                 </h3>
//                 <div className="bg-gray-50 p-4 rounded-md">
//                   <p className="font-medium text-gray-900">
//                     {order.address.fullName}
//                   </p>
//                   <p className="text-gray-700">{order.address.street}</p>
//                   <p className="text-gray-700">
//                     {order.address.city}, {order.address.state} -{" "}
//                     {order.address.zipCode}
//                   </p>
//                   <p className="text-gray-700">{order.address.country}</p>
//                   <p className="mt-2 text-gray-700">
//                     <span className="font-medium">Phone:</span>{" "}
//                     {order.address.phone}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                   Payment Information
//                 </h3>
//                 <div className="bg-gray-50 p-4 rounded-md">
//                   <div className="grid grid-cols-2 gap-2">
//                     <span className="font-medium text-gray-700">Method:</span>
//                     <span className="capitalize">
//                       {order?.paymentMethod?.toLowerCase()}
//                     </span>
//                     <span className="font-medium text-gray-700">Status:</span>
//                     <span>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           order.paymentStatus === "Paid"
//                             ? "bg-green-100 text-green-800"
//                             : order.paymentStatus === "Pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {order?.paymentStatus?.toLowerCase()}
//                       </span>
//                     </span>
//                     <span className="font-medium text-gray-700">Amount:</span>
//                     <span className="font-bold">
//                       ₹{order?.totalAmount?.toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Order Details
//               </h3>
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                         Item
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                         Price
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                         Qty
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {order.items.map((item) => (
//                       <tr key={item._id}>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center">
//                             {item.productId.images?.length > 0 && (
//                               <img
//                                 src={item.productId.images[0]}
//                                 className="h-12 w-12 rounded-md object-cover border"
//                               />
//                             )}

//                             <div className="ml-4">
//                               <div className="font-medium">
//                                 {item.productId.name}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {item?.productId?.description?.substring(0, 60)}
//                                 ...
//                               </div>
//                               {item.variantId && (
//                                 <div className="mt-1">
//                                   <span className="px-2.5 py-0.5 bg-primary text-white text-xs rounded-full"></span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           ₹{item.price.toLocaleString("en-IN")}
//                         </td>
//                         <td className="px-6 py-4">{item.quantity}</td>
//                         <td className="px-6 py-4 font-medium">
//                           ₹
//                           {(item.price * item.quantity).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-6 border-t">
//               <div className="max-w-md ml-auto">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                   Order Summary
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">
//                       ₹{order?.totalAmount?.toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="font-medium">Free</span>
//                   </div>
//                   <div className="border-t pt-3 flex justify-between font-bold text-lg">
//                     <span>Total Amount</span>
//                     <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               <div className="text-center md:text-left">
//                 <h3 className="text-xl font-bold mb-2">Thank You!</h3>
//                 <p className="text-blue-100">
//                   We appreciate your business. Please contact us if you have any
//                   questions.
//                 </p>
//               </div>
//               <button
//                 onClick={handleDownloadInvoice}
//                 disabled={downloading}
//                 className="flex items-center gap-2 bg-white text-primary hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-70 shadow-md"
//               >
//                 {downloading ? (
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                 ) : (
//                   <Download className="h-5 w-5" />
//                 )}
//                 Download Invoice
//               </button>
//             </div>
//           </div>

//           <div className="bg-gray-800 text-gray-300 p-4 text-center text-sm">
//             <p>
//               © {new Date().getFullYear()} Health Gainer. All rights reserved.
//             </p>
//             <p className="mt-1">GSTIN:23BYVPK8544D1Z3</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import API from "@/lib/api";
import {
  Download,
  ArrowLeft,
  Loader2,
  Home,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

export default function OrderConfirmationPage({ params }) {
  const { orderId } = useParams(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  // Helper to get dealOfTheDay first or fallback to productId
  const getItemData = (item) => {
    const data = item.dealOfTheDay || item.productId || {};
    return data;
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/orders/${orderId}`);
        const data = response.data;
        console.log(response);

        if (!data.success) throw new Error("Order not found");
        setOrder(data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const invoiceElement = document.getElementById("invoice-section");
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Invoice_${order._id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-secondary mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Orders</span>
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div id="invoice-section" className="p-0">
            {/* Header */}
            <div className="bg-black p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white p-2 rounded-md">
                      <img className="w-20" src="/logo.png" alt="logo" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Health Gainer</h1>
                      <p className="text-white">Quality Healthcare Products</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Home className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>123 Health Street, Bhopal, MP 462001</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>support@pharmascience.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Mon-Sat: 9AM - 7PM</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-md">
                  <h2 className="text-xl font-bold mb-2">INVOICE</h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="font-medium">Invoice #</span>
                    <span>{order._id}</span>
                    <span className="font-medium">Date</span>
                    <span>{formatDate(order.createdAt)}</span>
                    <span className="font-medium">Status</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Bill To
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium text-gray-900">
                    {order.address.fullName}
                  </p>
                  <p className="text-gray-700">{order.address.street}</p>
                  <p className="text-gray-700">
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.zipCode}
                  </p>
                  <p className="text-gray-700">{order.address.country}</p>
                  <p className="mt-2 text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {order.address.phone}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-700">Method:</span>
                    <span className="capitalize">
                      {order?.paymentMethod?.toLowerCase()}
                    </span>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : order.paymentStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order?.paymentStatus?.toLowerCase()}
                      </span>
                    </span>
                    <span className="font-medium text-gray-700">Amount:</span>
                    <span className="font-bold">
                      ₹{order?.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Details
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => {
                      const data = getItemData(item);
                      console.log("====================================");
                      console.log(data);
                      console.log("====================================");
                      return (
                        <tr key={item._id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={
                                  data.images?.[0] ||
                                  data.image ||
                                  "/placeholder.png"
                                }
                                alt={data.name || data.title || "Product"}
                                className="h-12 w-12 rounded-md object-cover border"
                              />
                              <div className="ml-4">
                                <div className="font-medium">
                                  {data.name || data.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {(
                                    data.description || data.subtitle
                                  )?.substring(0, 60)}
                                  ...
                                </div>
                                {item.variantId && (
                                  <div className="mt-1">
                                    <span className="px-2.5 py-0.5 bg-primary text-white text-xs rounded-full"></span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            ₹{item.price.toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4 font-medium">
                            ₹
                            {data?.type == "viewplan"
                              ? order.totalAmount.toLocaleString("en-IN")
                              : (item.price * item.quantity).toLocaleString(
                                  "en-IN"
                                )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 border-t">
              <div className="max-w-md ml-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{order?.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You & Download */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-blue-100">
                  We appreciate your business. Please contact us if you have any
                  questions.
                </p>
              </div>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="flex items-center gap-2 bg-white text-primary hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-70 shadow-md"
              >
                {downloading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                Download Invoice
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 text-gray-300 p-4 text-center text-sm">
            <p>
              © {new Date().getFullYear()} Health Gainer. All rights reserved.
            </p>
            <p className="mt-1">GSTIN:23BYVPK8544D1Z3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
