"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchProducts, deleteProduct } from "@/redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";

const SearchIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    className="w-3 h-3 ml-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const TableHeader = ({ label, sortKey, onSort, sortConfig }) => (
  <th className="p-3 text-left cursor-pointer" onClick={() => onSort(sortKey)}>
    <div className="flex items-center">
      {label} <SortIcon />
    </div>
  </th>
);

const ActionButton = ({
  href,
  onClick,
  icon: Icon,
  color,
  label,
  className = "",
}) => {
  const buttonClass = `${color} transition-colors p-1 rounded hover:bg-opacity-10 ${className}`;

  if (href) {
    return (
      <Link href={href}>
        <button aria-label={label} className={buttonClass}>
          <Icon />
        </button>
      </Link>
    );
  }

  return (
    <button aria-label={label} className={buttonClass} onClick={onClick}>
      <Icon />
    </button>
  );
};

const ProductRow = ({ product, onDelete }) => (
  <tr className="border-b hover:bg-gray-50 transition-colors">
    <td className="p-3 flex items-center space-x-2 w-64">
      <img
        src={product.images?.[0]}
        alt={product.name}
        width={40}
        height={40}
        className="rounded-md object-cover"
        loading="lazy"
      />
      <span className="truncate">{product.name}</span>
    </td>
    <td className="p-3">₹{product.mrp}</td>
    <td className="p-3">₹{product.price}</td>
    <td className="p-3">{product.stock}</td>
    {/* <td className="p-3">
      <Link href={`/admin/add-variant/${product._id}`}>
        <button className="text-blue-500 hover:text-blue-700 transition-colors">
          Add Variant
        </button>
      </Link>
    </td> */}
    <td className="p-3">
      <div className="flex items-center space-x-2">
        <ActionButton
          href={`/admin/products/${product._id}`}
          icon={EyeIcon}
          color="text-blue-500 hover:text-blue-700"
          label="View Product"
        />
        <ActionButton
          onClick={() => onDelete(product._id)}
          icon={TrashIcon}
          color="text-red-500 hover:text-red-700"
          label="Delete Product"
        />
        <ActionButton
          href={`/admin/edit-product/${product._id}`}
          icon={EditIcon}
          color="text-green-500 hover:text-green-700"
          label="Edit Product"
        />
      </div>
    </td>
  </tr>
);

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch = useDispatch();
  const {
    products: productsData,
    loading,
    error,
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const processedProducts = useMemo(() => {
    const products = productsData?.products || [];
    const filtered = products.filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name?.toLowerCase().includes(query) ||
        product.status?.toLowerCase().includes(query) ||
        product.price?.toString().includes(query)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [productsData?.products, searchQuery, sortConfig]);
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = processedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleDelete = useCallback(
    async (productId) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      try {
        const result = await dispatch(deleteProduct(productId));

        if (deleteProduct.fulfilled.match(result)) {
          toast.success("Product deleted successfully");
          dispatch(fetchProducts());
        } else {
          toast.error("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Something went wrong while deleting");
      }
    },
    [dispatch]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const tableHeaders = useMemo(
    () => [
      { label: "Name", sortKey: "name" },
      { label: "MRP", sortKey: "mrp" },
      { label: "Price", sortKey: "price" },
      { label: "Stock", sortKey: "stock" },
    ],
    []
  );

  if (loading) {
    return (
      <div className="py-6 px-2 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-blue-500 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-2 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-2 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <div className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>

          <button className="flex items-center bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full md:w-auto">
            <DownloadIcon />
            Export
          </button>

          <Link href="/admin/create-product">
            <button className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full md:w-auto">
              <PlusIcon />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                {tableHeaders.map((header) => (
                  <TableHeader
                    key={header.sortKey}
                    label={header.label}
                    sortKey={header.sortKey}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />
                ))}
                {/* <th className="p-3 text-left">Add Variant</th> */}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    {searchQuery
                      ? "No products found matching your search."
                      : "No products found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, processedProducts.length)} of{" "}
          {processedProducts.length} products
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
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
