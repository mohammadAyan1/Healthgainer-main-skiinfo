"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHealthGainers,
  deleteHealthGainer,
  updateHealthGainer,
} from "@/redux/slices/healthGainerSlice";

const AdminHealthGainerPage = () => {
  const dispatch = useDispatch();
  const { healthGainers, loading, error } = useSelector(
    (state) => state.healthGainer
  );

  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchHealthGainers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Health Gainer?")) {
      setIsDeleting(true);
      try {
        await dispatch(deleteHealthGainer(id)).unwrap();
      } catch (err) {
        console.error("Delete failed:", err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (gainer) => {
    setEditData({
      ...gainer,
      ingredients: gainer.ingredients.join(", "),
      benefits: gainer.benefits.join(", "),
      prohibitions: gainer.prohibitions.join(", "),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...editData,
        ingredients: editData.ingredients.split(",").map((item) => item.trim()),
        benefits: editData.benefits.split(",").map((item) => item.trim()),
        prohibitions: editData.prohibitions
          .split(",")
          .map((item) => item.trim()),
      };

      await dispatch(
        updateHealthGainer({ id: editData._id, data: formattedData })
      ).unwrap();
      setEditData(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleView = (gainer) => {
    setViewData(gainer);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFAQ = [...editData.faq];
    updatedFAQ[index][field] = value;
    setEditData({ ...editData, faq: updatedFAQ });
  };

  const addFAQ = () => {
    setEditData({
      ...editData,
      faq: [...editData.faq, { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index) => {
    const updatedFAQ = editData.faq.filter((_, i) => i !== index);
    setEditData({ ...editData, faq: updatedFAQ });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Manage Products Tabs
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            View, edit, and manage all health gainer products
          </p>
        </div>

        {healthGainers.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No Health Gainers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthGainers.map((gainer) => (
                  <tr key={gainer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {/* <img className="h-10 w-10 rounded-full object-cover" src={gainer.product.images[0] || "/placeholder-product.jpg"} alt={gainer.product.name} /> */}
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              gainer?.product?.images?.[0] ||
                              "/placeholder-product.jpg"
                            }
                            alt={gainer?.product?.name || "No name"}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {gainer?.product?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {gainer?.product?.discount}% off
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {gainer?.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {gainer?.product?.mrp}.00
                      </div>
                      <div className="text-sm text-gray-500">
                        {(
                          gainer?.product?.mrp *
                          (1 - gainer?.product?.discount / 100)
                        ).toFixed(0)}
                        .00
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          gainer?.product?.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {gainer?.product?.stock > 0
                          ? `${gainer?.product?.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(gainer)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(gainer)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(gainer?._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setViewData(null)}
              ></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {viewData?.product?.name}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setViewData(null)}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={
                            viewData?.product?.images[0] ||
                            "/placeholder-product.jpg"
                          }
                          alt={viewData?.product?.name}
                          className="w-full h-64 object-contain rounded-lg"
                        />
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900">
                            Price Details
                          </h4>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              MRP: {viewData?.product?.mrp}.00
                            </p>
                            <p className="text-sm text-gray-500">
                              Discount: {viewData?.product?.discount}%
                            </p>
                            <p className="text-lg font-semibold">
                              Final Price:{" "}
                              {(
                                viewData?.product?.mrp *
                                (1 - viewData?.product?.discount / 100)
                              ).toFixed(0)}
                              .00
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="h-96 overflow-x-scroll p-4">
                        <div className="mb-4 ">
                          <h4 className="font-medium text-gray-900">
                            Description
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {viewData?.description}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900">
                            How to Use
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {viewData?.howToUse}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900">
                            Ingredients
                          </h4>
                          <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                            {viewData?.ingredients.map((ingredient, index) => (
                              <li key={index}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900">
                            Benefits
                          </h4>
                          <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                            {viewData?.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900">
                            Prohibitions
                          </h4>
                          <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                            {viewData?.prohibitions?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900">FAQs</h4>
                      <div className="mt-2 space-y-3">
                        {viewData.faq.map((faqItem, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <p className="font-medium text-gray-800">
                              {faqItem?.question}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {faqItem?.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setViewData(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setEditData(null)}
              ></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit Health Gainer
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setEditData(null)}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <form onSubmit={handleUpdate} className="mt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            rows={3}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            How to Use
                          </label>
                          <input
                            type="text"
                            name="howToUse"
                            value={editData.howToUse}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ingredients (comma separated)
                          </label>
                          <textarea
                            name="ingredients"
                            value={editData.ingredients}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            rows={3}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Benefits (comma separated)
                          </label>
                          <textarea
                            name="benefits"
                            value={editData.benefits}
                            onChange={handleEditChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            rows={3}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Prohibitions (comma separated)
                        </label>
                        <textarea
                          name="prohibitions"
                          value={editData.prohibitions}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700">
                            FAQs
                          </label>
                          <button
                            type="button"
                            onClick={addFAQ}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add FAQ
                          </button>
                        </div>
                        <div className="mt-2 space-y-3">
                          {editData.faq.map((faq, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  FAQ #{index + 1}
                                </span>
                                {editData.faq.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeFAQ(index)}
                                    className="text-xs text-red-600 hover:text-red-900"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                placeholder="Question"
                                value={faq.question}
                                onChange={(e) =>
                                  handleFAQChange(
                                    index,
                                    "question",
                                    e.target.value
                                  )
                                }
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
                                required
                              />
                              <textarea
                                placeholder="Answer"
                                value={faq.answer}
                                onChange={(e) =>
                                  handleFAQChange(
                                    index,
                                    "answer",
                                    e.target.value
                                  )
                                }
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                rows={2}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Update Health Gainer
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => setEditData(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHealthGainerPage;
