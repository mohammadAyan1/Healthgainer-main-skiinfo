'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderByUserId } from '@/redux/slices/orderSlice';
import Link from 'next/link';
import { ArrowRight, Loader2, Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderByUserId());
    }, [dispatch]);

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'processing':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'shipped':
                return <Truck className="h-4 w-4 text-blue-500" />;
            default:
                return <Package className="h-4 w-4 text-gray-500" />;
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                            <p className="text-red-800 font-medium">Error loading orders</p>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-6 w-6 text-primary" />
                            My Orders
                        </h1>
                        <p className="text-gray-600 mt-1">View your order history and track current orders</p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-primary hover:text-secondary transition-colors"
                    >
                        Continue Shopping <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <Package className="h-12 w-12 mx-auto text-gray-400" />
                        <h2 className="text-xl font-medium text-gray-900 mt-4">No orders yet</h2>
                        <p className="text-gray-600 mt-2">You haven&apos;t placed any orders with us yet</p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <h2 className="text-lg font-semibold text-gray-900">
                                                    Order #{order.orderId}
                                                </h2>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{order.totalAmount?.toLocaleString('en-IN') || order.totalPrice?.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/user/user-orders/${order._id}`}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                                        >
                                            View Details <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;