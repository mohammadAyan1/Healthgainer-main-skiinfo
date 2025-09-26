"use client";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "@/redux/slices/productSlice";
import { deleteVariant } from "@/redux/slices/variantSlice";
import { useEffect, useState, useCallback, useMemo } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Link from "next/link";

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const InfoItem = ({ label, value, className = "" }) => (
  <div className={className}>
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="font-semibold">{typeof value === 'string' ? value : value}</p>
  </div>
);

const VariantCard = ({ variant, index, productId, onDelete }) => {
  const variantInfo = useMemo(() => [
    { label: "Weight", value: variant.weight },
    { label: "MRP", value: `₹ ${variant.mrp}` },
    { label: "Price", value: `₹ ${variant.price}` },
    { label: "Discount", value: `${variant.discount}%` },
    { label: "Stock", value: variant.stock },
    {
      label: "Availability",
      value: (
        <span className={`font-semibold ${variant.isAvailable ? "text-green-600" : "text-red-600"}`}>
          {variant.isAvailable ? "Available" : "Out of Stock"}
        </span>
      ),
    },
  ], [variant]);

  return (
    <div className="border p-4 rounded-lg mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {variantInfo.map((item, idx) => (
            <InfoItem key={idx} label={item.label} value={item.value} />
          ))}
        </div>
        
        <div className="flex space-x-2 ml-4">
          <Link href={`/admin/products/${productId}/variants/${variant._id}/edit`}>
            <button
              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
              aria-label="Edit variant"
            >
              <EditIcon />
            </button>
          </Link>
          <button
            onClick={() => onDelete(variant._id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
            aria-label="Delete variant"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {variant.images?.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-600 text-sm mb-2">Images:</p>
          <div className="flex flex-wrap gap-2">
            {variant.images.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`Variant ${index + 1} Image ${idx + 1}`}
                className="w-16 h-16 object-cover rounded-lg"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => ({
    product: state?.product?.product?.product,
    loading: state?.product?.product?.loading || false,
    error: state?.product?.product?.error || null
  }));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  const handleDeleteVariant = useCallback(async (variantId) => {
    try {
      await dispatch(deleteVariant({ productId: id, variantId }));
      alert("Variant deleted successfully!");
      setIsDialogOpen(false);
      setVariantToDelete(null);
      dispatch(fetchProductById(id));
    } catch (error) {
      console.error("Error deleting variant:", error);
      alert("Failed to delete variant.");
    }
  }, [dispatch, id]);

  const openDeleteDialog = useCallback((variantId) => {
    setVariantToDelete(variantId);
    setIsDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDialogOpen(false);
    setVariantToDelete(null);
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const productInfo = useMemo(() => {
    if (!product) return [];
    
    return [
      { label: "Category", value: product.category },
      { label: "MRP", value: `₹ ${product.mrp}` },
      { label: "Price", value: `₹ ${product.price}` },
      { label: "Stock", value: product.stock },
      { label: "Discount", value: `${product.discount}%` },
      {
        label: "Status",
        value: (
          <span className={`font-semibold ${product.status === "Active" ? "text-green-600" : "text-red-600"}`}>
            {product.status}
          </span>
        ),
      },
      { label: "Created At", value: new Date(product.createdAt).toLocaleDateString() },
    ];
  }, [product]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-blue-500 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchProductById(id))}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-4 py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-semibold mb-6">Product Details</h2>
        
        <div className="space-y-6">

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                width={150}
                height={150}
                className="rounded-md self-start object-cover"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              {product.description && (
                <p className="text-gray-600 mt-2">{product.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productInfo.map((item, index) => (
              <InfoItem key={index} label={item.label} value={item.value} />
            ))}
          </div>

          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-6">Variants</h3>
            {product.variants?.length > 0 ? (
              product.variants.map((variant, index) => (
                <VariantCard
                  key={variant._id}
                  variant={variant}
                  index={index}
                  productId={id}
                  onDelete={openDeleteDialog}
                />
              ))
            ) : (
              <p className="text-gray-500">No variants available for this product.</p>
            )}
          </section>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={() => handleDeleteVariant(variantToDelete)}
        title="Delete Variant"
        message="Are you sure you want to delete this variant?"
      />
    </div>
  );
}