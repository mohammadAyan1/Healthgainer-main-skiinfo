"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, updateProduct } from "@/redux/slices/productSlice";
import dynamic from "next/dynamic";

const { toast } = dynamic(() => import("react-toastify"), { ssr: false });

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    mrp: "",
    discount: "",
    stock: "",
    description: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        status: product.status || "Active",
        mrp: product.mrp || "",
        discount: product.discount || "",
        stock: product.stock || "",
        description: product.description || "",
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleRemoveExistingImage = useCallback((index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveNewImage = useCallback((index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleFileChange = useCallback((e) => {
    setNewImages([...e.target.files]);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("id", id);
        Object.entries(formData).forEach(([key, value]) =>
          formDataToSend.append(key, value)
        );

        existingImages.forEach((image, index) => {
          formDataToSend.append(`existingImages[${index}]`, image);
        });

        newImages.forEach((file) => {
          formDataToSend.append("newImages", file);
        });

       

        const response = await dispatch(updateProduct(formDataToSend)).unwrap();
        

        (await toast).success("Product updated successfully!");
        router.push("/admin/products");
      } catch (error) {
        
        (await toast).error(error || "Failed to update product.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, formData, existingImages, newImages, dispatch, router]
  );

  const existingImagePreview = useMemo(
    () =>
      existingImages.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image}
            alt={`Product Image ${index + 1}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleRemoveExistingImage(index)}
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
          >
            &times;
          </button>
        </div>
      )),
    [existingImages, handleRemoveExistingImage]
  );

  const newImagePreview = useMemo(
    () =>
      newImages.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={URL.createObjectURL(image)}
            alt={`New Image ${index + 1}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleRemoveNewImage(index)}
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
          >
            &times;
          </button>
        </div>
      )),
    [newImages, handleRemoveNewImage]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      {product && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">MRP</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Discount</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Existing Images</label>
            <div className="flex flex-wrap gap-2">{existingImagePreview}</div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Upload New Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <div className="flex flex-wrap gap-2 mt-2">{newImagePreview}</div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300"
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </form>
      )}
    </div>
  );
}
