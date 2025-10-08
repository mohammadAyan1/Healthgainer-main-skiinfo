"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { todayLogins } from "@/redux/slices/authSlice";
import { getAllUsers } from "@/redux/slices/authSlice";

export default function TodayLogin() {
  const dispatch = useDispatch();
  const { users = [], loading } = useSelector((state) => state.auth || {});

  console.log(users);

  const [formattedUsers, setFormattedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ✅ Fetch users on mount
  useEffect(() => {
    const fetchData = async () => {
      console.log("sdfghjky");

      setIsInitialLoading(true);
      await dispatch(todayLogins());
      setIsInitialLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchAllUser = async () => {
      dispatch(getAllUsers());
    };
    fetchAllUser();
  }, [dispatch]);

  // ✅ Format data after fetch
  useEffect(() => {
    if (typeof window === "undefined") return; // ⛔ Avoid running during SSR

    if (users?.length) {
      const formattedData = users.map((user) => ({
        ...user,
        formattedDate: user.lastLogin
          ? new Date(user.lastLogin).toLocaleString()
          : "N/A",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      }));
      setFormattedUsers(formattedData);
    } else {
      setFormattedUsers([]);
    }
  }, [users]);

  // ✅ Search filter
  const filteredUsers = formattedUsers.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase()?.includes(term) ||
      user.email?.toLowerCase()?.includes(term) ||
      (user.mobileNumber || "")?.toString()?.includes(term)
    );
  });

  // ✅ Sort toggle
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  // ✅ Pagination
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // ✅ Sort after pagination
  const sortedUsers = [...currentUsers].sort((a, b) => {
    let valA = a[sortField] || "";
    let valB = b[sortField] || "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="container mx-auto p-4 card-body-main">
      <h1 className="text-2xl font-semibold mb-4">Users Who Logged in Today</h1>

      {/* 🔍 Search + Rows per page */}
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-gray-700"
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-600">
              <th
                className="py-3 px-4 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortField === "name" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th
                className="py-3 px-4 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email{" "}
                {sortField === "email" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th className="py-3 px-4">Mobile Number</th>
              <th className="py-3 px-4">Role</th>
              <th
                className="py-3 px-4 cursor-pointer"
                onClick={() => handleSort("formattedDate")}
              >
                Last Login{" "}
                {sortField === "formattedDate" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* 🕐 Show loader before data */}
            {isInitialLoading || loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-4 text-center text-gray-500 italic"
                >
                  Loading users...
                </td>
              </tr>
            ) : sortedUsers.length > 0 ? (
              sortedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {user.mobileNumber || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {user.role}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {user.formattedDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-4 text-center text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-end items-center mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
