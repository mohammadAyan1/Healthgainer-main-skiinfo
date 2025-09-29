"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts, deleteContact } from "@/redux/slices/contactSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { deleteReq, fetchReq } from "@/redux/slices/reqCallbackSlice";
import dayjs from "dayjs";

const ContactList = () => {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector(
    (state) => state.requestCall
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  useEffect(() => {
    dispatch(fetchReq());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      dispatch(deleteReq(id));
      toast.success("Contact deleted successfully!");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredContacts = sortedContacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Date", key: "date" },
  ];

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-3xl font-bold text-center mb-6'
      >
        Request Contact List
      </motion.h1>

      <div className='flex justify-between mb-4'>
        <input
          type='text'
          placeholder='Search contacts...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='p-2 border rounded-md w-full max-w-md'
        />
        <CSVLink
          data={contacts}
          headers={csvHeaders}
          filename='contacts.csv'
          className='bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary ml-4'
        >
          Export CSV
        </CSVLink>
      </div>

      {loading ? (
        <p className='text-center text-lg'>Loading...</p>
      ) : error ? (
        <p className='text-center text-red-500'>Error: {error}</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <thead>
              <tr className='bg-gray-200'>
                <th
                  className='p-3 cursor-pointer'
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortConfig.key === "name"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className='p-3 cursor-pointer'
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortConfig.key === "email"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className='p-3 cursor-pointer'
                  onClick={() => handleSort("phone")}
                >
                  Phone{" "}
                  {sortConfig.key === "phone"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className='p-3 cursor-pointer'
                  onClick={() => handleSort("date")}
                >
                  Date{" "}
                  {sortConfig.key === "date"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th className='p-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact, index) => (
                <motion.tr
                  key={contact._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='border-b hover:bg-gray-100'
                >
                  <td className='p-3 text-center'>{contact.name}</td>
                  <td className='p-3 text-center'>{contact.email}</td>
                  <td className='p-3 text-center'>{contact.phone}</td>
                  <td className='p-3 text-center'>
                    {dayjs(contact.createdAt).format("DD-MM-YYYY hh:mm A")}
                  </td>

                  <td className='p-3 text-center'>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='flex justify-center mt-4'>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className='px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50'
        >
          Prev
        </button>
        <span className='px-4 py-2 mx-1'>{currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              indexOfLastContact < filteredContacts.length ? prev + 1 : prev
            )
          }
          disabled={indexOfLastContact >= filteredContacts.length}
          className='px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactList;
