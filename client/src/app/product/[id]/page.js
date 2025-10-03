"use client";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "@/redux/slices/productSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
} from "react-icons/fa";
import { toast } from "react-toastify";
import TabbedProductInfo from "@/components/TabbedProductInfo";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product.product) || {};
  const { loading, error } = useSelector((state) => state.product);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product && product.images) {
      setSelectedImage(product.images[0] || "");

      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant({
          _id: product._id,
          price: product.price,
          mrp: product.mrp,
          discount: product.discount || 0,
          weight: product.weight || "",
          images: product.images || [],
        });
      }
    }
  }, [product]);

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % product.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(product.images[nextIndex]);
  };

  const handlePreviousImage = () => {
    const prevIndex =
      (currentImageIndex - 1 + product.images.length) % product.images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(product.images[prevIndex]);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant before adding to cart.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user")) || null;

    const userId = user?._id;
    const guestId = localStorage.getItem("guestId");

    try {
      await dispatch(
        addToCart({
          userId,
          productId: product._id,
          guestId,
          variantId:
            product.variants && product.variants.length > 0
              ? selectedVariant._id
              : null,
          quantity,
        })
      ).unwrap();
      toast.success("Item added to cart successfully!");
    } catch (err) {
      toast.error("Failed to add item to cart");
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      !isWishlisted ? "Added to wishlist" : "Removed from wishlist"
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <Skeleton height={400} className="rounded-lg" />
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  height={80}
                  width={80}
                  className="rounded-lg"
                />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Skeleton height={40} width="80%" className="mb-4" />
            <Skeleton count={4} className="mb-2" />
            <Skeleton height={30} width="40%" className="my-4" />
            <Skeleton height={30} width="60%" className="mb-4" />
            <Skeleton height={50} width="100%" className="mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-2xl mx-auto">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 max-w-2xl mx-auto">
          <p className="font-bold">Product Not Found</p>
          <p>The requested product could not be found.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 min-h-screen py-8"
    >
      <div className="container mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 p-6">
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {selectedImage && (
                  <motion.img
                    key={currentImageIndex}
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                >
                  <FaChevronRight />
                </button>
              </div>

              <div className="flex gap-3 mt-4 overflow-x-auto py-2 scrollbar-hide">
                {product.images?.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedImage(img);
                      setCurrentImageIndex(index);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition ${
                      currentImageIndex === index
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= 4 ? "fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">(42 reviews)</span>
                </div>

                <p className="text-gray-700 mb-6">{product.description}</p>

                {product.variants?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <motion.button
                          key={variant._id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setSelectedImage(
                              variant.images?.[0] || product.images?.[0]
                            );
                          }}
                          className={`px-4 py-2 rounded-lg border transition ${
                            selectedVariant?._id === variant._id
                              ? " border-primary text-secondar"
                              : "bg-white border-gray-300 text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          {variant.weight}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{selectedVariant?.price ?? product.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{selectedVariant?.mrp ?? product.mrp}
                    </span>
                    <span className="text-lg font-semibold text-green-600">
                      {selectedVariant?.discount ?? product.discount}% OFF
                    </span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-6 md:w-12 text-center border-0 focus:ring-0"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      >
                        +
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary hover:bg-secondary hover:text-black text-white py-2 md:py-3 md:px-6 rounded-lg font-sm md:font-medium flex items-center justify-center gap-2 transition"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">
                        Free shipping on orders over ₹500
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">
                        30-day return policy
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">
                        Authentic product guarantee
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <TabbedProductInfo productId={product._id} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
