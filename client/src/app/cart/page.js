"use client";

import { useEffect } from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShoppingBag,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
  emptyCart,
} from "@/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items || []);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    let guestId;
    if (!user?._id) {
      guestId = localStorage.getItem("guestId");
    }

    if (user?._id) {
      dispatch(fetchCart(user._id));
    } else {
      dispatch(fetchCart(guestId));
    }
  }, [dispatch, user]);

  const updateQuantity = (itemId, quantity) => {
    if (quantity > 0) {
      let payload = { itemId, quantity };

      if (user?._id) {
        // Logged in user
        payload.userId = user._id;
      } else {
        // Guest user
        const guestId = localStorage.getItem("guestId");
        if (!guestId) {
          console.error("No guestId found in localStorage");
          return;
        }
        payload.guestId = guestId;
      }

      dispatch(updateCartQuantity(payload));
    }
  };

  const removeItem = (itemId) => {
    let payload = { itemId };

    if (user?._id) {
      payload.userId = user?._id;
    } else {
      const guestId = localStorage.getItem("guestId");
      if (!guestId) {
        console.error("No guestId found in localStorage");
        return;
      }
      payload.guestId = guestId;
    }

    dispatch(removeFromCart({ payload }));
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0) ||
    0;

  const calculateSavings = () =>
    cartItems.reduce(
      (total, item) =>
        total + ((item.mrp || 0) - (item.price || 0)) * (item.quantity || 0),
      0
    ) || 0;

  const calculateItemCount = () =>
    (cartItems || []).reduce((count, item) => count + (item.quantity || 0), 0);

  console.log(user);
  console.log(cartItems);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Your Shopping Cart</h1>
          <button
            onClick={() => router.push("/product")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {calculateItemCount() === 0 ? (
          <div className="text-center py-12">
            <FaShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-4 text-2xl font-medium">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">
              Start adding some products to your cart
            </p>
            <button
              onClick={() => router.push("/product")}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center mx-auto"
            >
              <FaArrowLeft className="mr-2" /> Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-8">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-medium">Cart Items</h2>
                  <button
                    onClick={() => dispatch(emptyCart(user._id))}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Empty Cart
                  </button>
                </div>

                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li
                      key={item._id}
                      className="p-4 flex flex-col sm:flex-row"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-24 h-24 rounded-md object-cover"
                      />
                      <div className="sm:ml-6 flex-1 mt-4 sm:mt-0">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {item.weight}
                            </p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">
                              ₹{item.price.toFixed(2)}
                            </p>
                            {item.mrp > item.price && (
                              <p className="text-sm line-through text-gray-500">
                                ₹{item.mrp.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="p-2 border rounded-l-md hover:bg-gray-100"
                            >
                              <FaMinus className="h-3 w-3" />
                            </button>
                            <span className="px-4 py-2 border-t border-b">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="p-2 border rounded-r-md hover:bg-gray-100"
                            >
                              <FaPlus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="ml-4 text-red-600 hover:text-red-800 flex items-center"
                          >
                            <FaTrash className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-4">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium">Order Summary</h2>
                <div className="flex justify-between mt-4">
                  <p>Subtotal ({calculateItemCount()} items)</p>
                  <p>₹{calculateTotal().toFixed(2)}</p>
                </div>
                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-green-600 mt-1">
                    <p>You save</p>
                    <p>₹{calculateSavings().toFixed(2)}</p>
                  </div>
                )}
                <div className="mt-4 border-t pt-4 flex justify-between font-medium">
                  <p>Total</p>
                  <p>₹{calculateTotal().toFixed(2)}</p>
                </div>

                <button
                  onClick={() => router.push(user ? "/checkout" : "/login")}
                  className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
