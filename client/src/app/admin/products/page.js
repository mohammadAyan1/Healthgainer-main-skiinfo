"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchProducts,
  deleteProduct,
  fetchProductById,
} from "@/redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";
import { useParams } from "next/navigation";

// ---------- Icons ----------
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

const SortIcon = ({ direction }) => (
  <svg
    className={`w-3 h-3 ml-1 ${direction === "asc" ? "rotate-180" : ""}`}
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

// ---------- Components ----------
const TableHeader = ({ label, sortKey, onSort, sortConfig }) => (
  <th className="p-3 text-left cursor-pointer" onClick={() => onSort(sortKey)}>
    <div className="flex items-center">
      {label}{" "}
      {sortConfig.key === sortKey && (
        <SortIcon direction={sortConfig.direction} />
      )}
    </div>
  </th>
);

const ActionButton = ({ href, onClick, icon: Icon, color, label }) => {
  const buttonClass = `${color} transition-colors p-1 rounded hover:bg-opacity-10`;
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
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        width={40}
        height={40}
        className="rounded-md object-cover"
        loading="lazy"
      />
      <span className="truncate">{product.name}</span>
    </td>
    <td className="p-3">₹{product.mrp ?? 0}</td>
    <td className="p-3">₹{product.price ?? 0}</td>
    <td className="p-3">{product.stock ?? 0}</td>
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

// ---------- Main Component ----------
export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const dispatch = useDispatch();
  const { id } = useParams();

  const { products, loading, error, deleteStatus } = useSelector(
    (state) => state.product
  );
  console.log(products);
  console.log(loading);
  console.log(error);
  console.log(deleteStatus);

  // Fetch all products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, deleteStatus]);

  // Fetch single product by ID (for details page)
  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [id, dispatch]);

  // Merge single product
  const mergedProducts = useMemo(() => {
    const list = products?.products || [];
    const single = products?.single;
    if (single && !list.find((p) => p._id === single._id))
      return [single, ...list];
    return list;
  }, [products]);

  const processedProducts = useMemo(() => {
    const filtered = mergedProducts?.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.status?.toLowerCase().includes(q) ||
        p.price?.toString().includes(q)
      );
    });
    if (sortConfig.key)
      filtered.sort((a, b) =>
        (a[sortConfig.key] ?? 0) < (b[sortConfig.key] ?? 0)
          ? sortConfig.direction === "asc"
            ? -1
            : 1
          : (a[sortConfig.key] ?? 0) > (b[sortConfig.key] ?? 0)
          ? sortConfig.direction === "asc"
            ? 1
            : -1
          : 0
      );
    return filtered;
  }, [mergedProducts, searchQuery, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(processedProducts.length / itemsPerPage)
  );
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

  // ✅ Delete Product (toast + remove from state without refetch)
  const handleDelete = useCallback(
    async (productId) => {
      if (!window.confirm("Are you sure you want to delete this product?"))
        return;
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        if (deleteStatus) {
          toast.success("Product deleted successfully"); // red toast
          dispatch(fetchProducts());
        }
      } catch (err) {
        // toast.error("Error deleting product");
        console.error("Delete error:", err);
        toast.error(err?.message || "Error deleting product");
      }
    },
    [dispatch]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);
  const handlePreviousPage = useCallback(
    () => setCurrentPage((p) => Math.max(p - 1, 1)),
    []
  );
  const handleNextPage = useCallback(
    () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    [totalPages]
  );

  const tableHeaders = useMemo(
    () => [
      { label: "Name", sortKey: "name" },
      { label: "MRP", sortKey: "mrp" },
      { label: "Price", sortKey: "price" },
      { label: "Stock", sortKey: "stock" },
    ],
    []
  );

  // ---------- Export CSV ----------
  const handleExport = useCallback(() => {
    if (!processedProducts || processedProducts.length === 0) {
      toast.info("No products to export");
      return;
    }

    try {
      const headers = ["Name", "MRP", "Price", "Stock", "Image"];
      const rows = processedProducts.map((p) => [
        `"${p.name ?? ""}"`,
        p.mrp ?? 0,
        p.price ?? 0,
        p.stock ?? 0,
        p.images?.[0] ?? "",
      ]);

      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `products_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export products");
    }
  }, [processedProducts]);

  if (loading)
    return (
      <div className="p-6 text-center text-blue-500 animate-pulse">
        Loading...
      </div>
    );
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="py-6 px-2 bg-gray-100 min-h-screen">
      {/* Header */}
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
          <button
            onClick={handleExport}
            className="flex items-center bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full md:w-auto"
          >
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

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                {tableHeaders.map((h) => (
                  <TableHeader
                    key={h.sortKey}
                    label={h.label}
                    sortKey={h.sortKey}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />
                ))}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((p) => (
                  <ProductRow key={p._id} product={p} onDelete={handleDelete} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    {searchQuery
                      ? "No products found matching your search"
                      : "No products found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, processedProducts.length)} of{" "}
          {processedProducts.length} products
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
