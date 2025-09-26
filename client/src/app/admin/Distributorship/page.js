"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchForms,
  deleteForm,
  updateForm,
} from "@/redux/slices/distributorship/distributorshipThunks";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";

const DistributorshipList = () => {
  const dispatch = useDispatch();
  const { distributorship, loading, error } = useSelector(
    (state) => state.distributorship
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "candidateName",
    direction: "asc",
  });

  const formsPerPage = 5;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [viewFormData, setViewFormData] = useState(null);

  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);

  const handleDelete = useCallback(
    (id) => {
      if (confirm("Are you sure you want to delete this form?")) {
        dispatch(deleteForm(id));
        toast.success("Form deleted successfully!");
      }
    },
    [dispatch]
  );

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      const direction =
        prev.key === key && prev.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  }, []);

  const openEditModal = useCallback((form) => {
    setEditFormData(form);
    setIsEditModalOpen(true);
  }, []);

  const openViewModal = useCallback((form) => {
    setViewFormData(form);
    setIsViewModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditFormData(null);
    setIsEditModalOpen(false);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewFormData(null);
    setIsViewModalOpen(false);
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await dispatch(updateForm(editFormData)).unwrap();
        toast.success("Form updated successfully!");
        closeEditModal();
        dispatch(fetchForms());
      } catch {
        toast.error("Error updating form.");
      }
    },
    [dispatch, editFormData, closeEditModal]
  );

  const sortedForms = useMemo(() => {
    return [...distributorship].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [distributorship, sortConfig]);

  const filteredForms = useMemo(() => {
    return sortedForms.filter(
      (form) =>
        form.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.districtName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.experience?.toString().includes(searchTerm)
    );
  }, [sortedForms, searchTerm]);

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = useMemo(
    () => filteredForms.slice(indexOfFirstForm, indexOfLastForm),
    [filteredForms, indexOfFirstForm, indexOfLastForm]
  );

  const csvHeaders = useMemo(
    () => [
      { label: "Name", key: "candidateName" },
      { label: "District", key: "districtName" },
      { label: "Mobile", key: "mobile" },
      { label: "Position District", key: "positionDistrict" },
      { label: "Position Zonal", key: "positionZonal" },
      { label: "Address", key: "address" },
      { label: "Pin Code", key: "pinCode" },
      { label: "Date of Birth", key: "dob" },
      { label: "PAN", key: "pan" },
      { label: "Aadhar", key: "aadhar" },
      { label: "Occupation", key: "occupation" },
      { label: "Experience", key: "experience" },
      { label: "Description", key: "description" },
      { label: "Start Date", key: "startDate" },
      { label: "Agent Duration", key: "agentDuration" },
      { label: "Sign Date", key: "signDate" },
      { label: "Signature", key: "signature" },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      distributorship.map((item) => ({
        candidateName: item.candidateName,
        districtName: item.districtName,
        mobile: item.mobile,
        positionDistrict: item.positionDistrict ? "Yes" : "No",
        positionZonal: item.positionZonal ? "Yes" : "No",
        address: item.address,
        pinCode: item.pinCode,
        dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
        pan: item.pan,
        aadhar: item.aadhar,
        occupation: item.occupation,
        experience: item.experience,
        description: item.description,
        startDate: item.startDate
          ? dayjs(item.startDate).format("DD-MM-YYYY")
          : "",
        agentDuration: item.agentDuration,
        signDate: item.signDate
          ? dayjs(item.signDate).format("DD-MM-YYYY")
          : "",
        signature: item.signature,
      })),
    [distributorship]
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Distributorship Forms
      </h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename="distributorship_forms.csv"
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export CSV
        </CSVLink>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("candidateName")}
                >
                  Name
                </th>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("districtName")}
                >
                  District
                </th>
                <th className="p-3">Position</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentForms.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-center">{item.candidateName}</td>
                  <td className="p-3 text-center">{item.districtName}</td>
                  <td className="p-3 text-center">
                    {item.positionDistrict && "District "}
                    {item.positionZonal && "Zonal"}
                  </td>
                  <td className="p-3 text-center">{item.mobile}</td>
                  <td className="p-3 text-center">{item.experience} yrs</td>
                  <td className="p-3 text-center">
                    {dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => openViewModal(item)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 mx-1">{currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              indexOfLastForm < filteredForms.length ? prev + 1 : prev
            )
          }
          disabled={indexOfLastForm >= filteredForms.length}
          className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isViewModalOpen && viewFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Form Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(viewFormData)
                .filter(
                  ([key]) =>
                    !["_id", "__v", "createdAt", "updatedAt"].includes(key)
                )
                .map(([key, value]) => {
                  let displayValue = value;
                  if (["dob", "startDate", "signDate"].includes(key)) {
                    displayValue = dayjs(value).format("DD-MM-YYYY");
                  }
                  return (
                    <div key={key} className="border-b pb-2">
                      <strong className="capitalize">{key}:</strong>{" "}
                      <span>{displayValue?.toString() || "-"}</span>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={closeViewModal}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded w-full">
            <h2 className="text-xl font-bold mb-4">Edit Form</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Name of Candidate:
                </label>
                <input
                  type="text"
                  name="candidateName"
                  value={editFormData.candidateName}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Position Nominated For:
                </label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="checkbox"
                      name="positionDistrict"
                      checked={editFormData.positionDistrict}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          positionDistrict: e.target.checked,
                        }))
                      }
                    />{" "}
                    District Distributor
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="positionZonal"
                      checked={editFormData.positionZonal}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          positionZonal: e.target.checked,
                        }))
                      }
                    />{" "}
                    Zonal Partner
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  District Name:
                </label>
                <input
                  type="text"
                  name="districtName"
                  value={editFormData.districtName}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Mobile:
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={editFormData.mobile}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Address:
                </label>
                <textarea
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  rows="2"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Pin Code:
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={editFormData.pinCode}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={editFormData.dob}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    PAN:
                  </label>
                  <input
                    type="text"
                    name="pan"
                    value={editFormData.pan}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Aadhaar:
                  </label>
                  <input
                    type="text"
                    name="aadhar"
                    value={editFormData.aadhar}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Occupation:
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={editFormData.occupation}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Experience (Years):
                </label>
                <input
                  type="number"
                  name="experience"
                  value={editFormData.experience}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Description:
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Start Date:
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dayjs(editFormData.startDate).format("YYYY-MM-DD")}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Expected Duration:
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {["Within 1 Week", "2 Weeks", "3 Weeks", "4 Weeks"].map(
                    (option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name="agentDuration"
                          value={option}
                          checked={editFormData.agentDuration === option}
                          onChange={handleEditChange}
                        />{" "}
                        {option}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Date:
                  </label>
                  <input
                    type="date"
                    name="signDate"
                    value={dayjs(editFormData.signDate).format("YYYY-MM-DD")}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Signature:
                  </label>
                  <input
                    type="text"
                    name="signature"
                    value={editFormData.signature}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorshipList;
