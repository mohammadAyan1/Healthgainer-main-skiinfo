"use client";
import { useState, useEffect } from "react";
import { fetchProducts } from "@/redux/slices/productSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function ProductGallery() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    products: productsData,
    loading,
    error,
  } = useSelector((state) => state.product);
  const [loadingProductId, setLoadingProductId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };
  

  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    let guestId = `guest-${crypto.randomUUID()}`;
    localStorage.setItem("guestId", guestId);
  }
  const handleAddToCart = async (product) => {
    setLoadingProductId(product._id);
    let guestId = user?._id ? null : localStorage.getItem("guestId");
  
    const userId = user?._id;

 

    try {
      
      await dispatch(
        addToCart({
          userId,
          guestId,
          productId: product._id,
          variantId: product.variants?.[0]?._id || null,
          quantity: 1,
        })
      ).unwrap();
      toast.success("Item added to cart successfully!");
  
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setLoadingProductId(null);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error)
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;

  return (
    <section className="bg-gradient-to-b from-blue-100 via-white to-blue-100 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">
          Explore <span className="text-primary">Our Products</span>
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Premium health gainers designed for your fitness journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-16 lg:px-24">
        {productsData?.products?.map((product) => (
          <motion.div
            key={product._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 cursor-pointer relative"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="relative w-full h-60 overflow-hidden flex items-center justify-center"
              onClick={() => handleProductClick(product._id)}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full py-2"
              />
              <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.discount}% OFF
              </span>
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <div className="flex justify-center items-center gap-2">
                <p className="text-lg font-bold text-black-600">
                  ₹{product.price}
                </p>
                <p className="text-sm line-through text-gray-400">
                  ₹{product.mrp}
                </p>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <motion.button
                className={`mt-6 w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff8c00] to-[#ff4500] hover:from-[#ff4500] hover:to-[#ff8c00] transform transition-all duration-500 ease-in-out ${
                  loadingProductId === product._id
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
                whileHover={{
                  scale: loadingProductId === product._id ? 1 : 1.1,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(product)}
                disabled={loadingProductId === product._id}
              >
                {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
