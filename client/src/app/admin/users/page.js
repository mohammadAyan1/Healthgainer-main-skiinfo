"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaSort, FaFileExport } from "react-icons/fa";
import { getAllUsers, updateUser, deleteUser } from "@/redux/slices/authSlice";

export default function Users() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.auth?.users || []);
  const { loading } = useSelector((state) => state?.auth || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getAllUsers()); // Fetch users on mount
  }, [dispatch]);

  // Handle Search
  const filteredUsers = users?.filter(
    (user) =>
      (user &&
        (user.firstName + " " + user.lastName)
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobileNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Handle Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleUpdate = async (userId, updatedRole) => {
    await dispatch(updateUser({ id: userId, role: updatedRole }));
    dispatch(getAllUsers());
    setEditingUserId(null);
  };

  const handleDelete = async (userId) => {
    await dispatch(deleteUser(userId));
    dispatch(getAllUsers());
  };

  // ---------- Export CSV ----------
  const handleExport = () => {
    if (!sortedUsers || sortedUsers.length === 0) {
      alert("No users to export");
      return;
    }

    try {
      const headers = ["Name", "Email", "Mobile Number", "Role"];
      const rows = sortedUsers.map((u) => [
        `"${u.firstName + " " + u.lastName}"`,
        u.email ?? "",
        u.mobileNumber ?? "",
        u.role ?? "",
      ]);

      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export users");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Search and Export Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors duration-200"
        >
          <FaFileExport className="mr-2" />
          Export
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center">
                  Name <FaSort className="ml-1 text-sm" />
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email <FaSort className="ml-1 text-sm" />
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("mobileNumber")}
              >
                <div className="flex items-center">
                  Number <FaSort className="ml-1 text-sm" />
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center">
                  Role <FaSort className="ml-1 text-sm" />
                </div>
              </th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-3">
                    {user.firstName + " " + user.lastName}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.mobileNumber}</td>

                  {/* Role cell with inline edit */}
                  <td className="p-3">
                    {editingUserId === user._id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdate(user._id, e.target.value)}
                        onBlur={() => setEditingUserId(null)}
                        autoFocus
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Moderator">Moderator</option>
                        <option value="User">User</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => setEditingUserId(user._id)}
                        className="cursor-pointer text-blue-600"
                      >
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, sortedUsers.length)} of{" "}
          {sortedUsers.length} users
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
