'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Truck, ArrowLeft, CreditCard, MapPin, Package } from 'lucide-react';
import API from '@/lib/api';

const OrderDetailsPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/orders/${id}`);
        const data = response.data;

        if (!data.success) throw new Error("Order not found");
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrderDetails();
  }, [id]);

  const getStatusIcon = () => {
    switch (order?.status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getTrackingSteps = () => {
    const steps = [
      {
        id: 'processing',
        name: 'Processing',
        description: 'Your order is being prepared',
        status: 'complete',
        date: order?.createdAt,
      },
      {
        id: 'shipped',
        name: 'Shipped',
        description: 'Your order has been shipped',
        status: order?.status.toLowerCase() === 'processing' ? 'pending' :
               ['shipped', 'delivered'].includes(order?.status.toLowerCase()) ? 'complete' : 'cancelled',
        date: order?.shippedAt,
      },
      {
        id: 'delivered',
        name: 'Delivered',
        description: 'Your order has been delivered',
        status: order?.status.toLowerCase() === 'delivered' ? 'complete' :
               order?.status.toLowerCase() === 'cancelled' ? 'cancelled' : 'pending',
        date: order?.deliveredAt,
      },
    ];

    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500" />
            <div className="ml-3">
              <p className="text-red-800 font-medium">Error loading order</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/user/user-orders')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-md">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-yellow-500" />
            <div className="ml-3">
              <p className="text-yellow-800 font-medium">Order Not Found</p>
              <p className="text-yellow-700">We couldn&apos;t find the order you&apos;re looking for.</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/user/user-orders')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps();

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
          <div className="bg-black p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Order Details</h1>
                <p className="text-white/90">Order #{order.orderId}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-md backdrop-blur-sm">
                {getStatusIcon()}
                <span className="capitalize font-medium">{order.status.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Tracking</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
              <ul className="space-y-6">
                {trackingSteps.map((step, index) => (
                  <li key={step.id} className="relative pl-10">
                    <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full">
                      {step.status === 'complete' ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      ) : step.status === 'cancelled' ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                      ) : (
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-primary' : 'bg-gray-200'
                        }`}>
                          {index === 0 ? (
                            <span className="text-white font-medium text-sm">{index + 1}</span>
                          ) : (
                            <span className="text-gray-600 font-medium text-sm">{index + 1}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className={`text-sm font-medium ${
                          step.status === 'complete' ? 'text-green-600' :
                          step.status === 'cancelled' ? 'text-red-600' :
                          index === 0 ? 'text-primary' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                      {step.date && (
                        <p className="text-xs text-gray-500 sm:text-right">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {order.status.toLowerCase() === 'shipped' && (
              <div className="mt-8 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="p-4 bg-primary text-white">
                  <h3 className="font-medium">Delivery in Progress</h3>
                  <p className="text-sm opacity-90">Your order is on its way</p>
                </div>
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Truck className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="text-gray-600">Live tracking map would be displayed here</p>
                    <p className="text-xs text-gray-500 mt-2">Estimated delivery: {formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium text-gray-700">Method:</span>
                  <span className="text-gray-700 capitalize">{order.paymentMethod.toLowerCase()}</span>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus.toLowerCase()}
                    </span>
                  </span>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Address
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium text-gray-900">{order.address.fullName}</p>
                <p className="text-gray-700">{order.address.street}</p>
                <p className="text-gray-700">{order.address.city}, {order.address.state} - {order.address.zipCode}</p>
                <p className="text-gray-700">{order.address.country}</p>
                <p className="mt-2 text-gray-700">
                  <span className="font-medium">Phone:</span> {order.address.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order Items
            </h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Health Gainer</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.variantId === "67cc7d996ebbf3bf5fbb1431" ? "100g" : "200g"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 p-6 border-t">
            <div className="max-w-md ml-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 12%)</span>
                  <span className="font-medium">₹{(order.totalAmount * 0.12).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-lg font-bold">
                    ₹{(order.totalAmount * 1.12).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.note && (
            <div className="p-6 border-t">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Notes</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
                <p className="text-sm text-yellow-700">
                  {order.note}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;