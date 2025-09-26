"use client";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/redux/slices/productSlice";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const INITIAL_STATE = {
  name: "",
  description: "",
  category: "",
  mrp: "",
  discount: "",
  stock: "",
  images: [],
};

const CreateProduct = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.product);
  const [productData, setProductData] = useState(INITIAL_STATE);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    setProductData(prev => ({ ...prev, images: e.target.files }));
  }, []);

  const resetForm = useCallback(() => {
    setProductData(INITIAL_STATE);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const { images, ...textFields } = productData;

    Object.entries(textFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (images?.length) {
      Array.from(images).forEach(image => {
        formData.append("images", image);
      });
    }

    try {
      const result = await dispatch(createProduct(formData)).unwrap();
      
      if (result.success) {
        toast.success("Product created successfully!");
        resetForm();
        router.push("/admin/products");
      } else {
        toast.error(result.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to create product!");
      console.error("Product creation error:", err);
    }
  }, [productData, dispatch, router, resetForm]);

  const inputClass = "w-full p-2 border mb-2";
  const buttonClass = `w-full px-4 py-2 rounded text-white ${
    loading ? "bg-gray-500 cursor-not-allowed" : "bg-primary"
  }`;

  return (
    <div className="max-w-lg mx-auto bg-white p-5 rounded-lg shadow-lg">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-xl font-semibold mb-4">Create Product</h2>

      {success && (
        <p className="text-green-500">
          {typeof success === "object" ? success.message : success}
        </p>
      )}
      {error && (
        <p className="text-red-500">
          {typeof error === "object" ? error.message : error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={productData.category}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={productData.mrp}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={productData.discount}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={productData.stock}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className={inputClass}
        />

        <button
          type="submit"
          className={buttonClass}
          disabled={loading}
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;