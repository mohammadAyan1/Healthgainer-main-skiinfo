"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { todayLogins } from '@/redux/slices/authSlice';

export default function TodayLogin() {
  const dispatch = useDispatch();
  const  users = useSelector((state) => state?.auth?.users || []);

  const [formattedUsers, setFormattedUsers] = useState([]);

  useEffect(() => {
    dispatch(todayLogins());
  }, [dispatch]);

  
  useEffect(() => {
    if (users?.length) {
      const formattedData = users.map((user) => ({
        ...user,
        formattedDate: new Date(user.lastLogin).toLocaleString(),
      }));
      setFormattedUsers(formattedData);
    }
  }, [users]);



  return (
    <div className="container mx-auto p-4 card-body-main">
      <h1 className="text-2xl font-semibold mb-4">Users Who Logged in Today</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 bg-gray-100">Name</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 bg-gray-100">Email</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 bg-gray-100">Mobile Number</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 bg-gray-100">Role</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 bg-gray-100">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {formattedUsers?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-700">{`${user.firstName} ${user.lastName}`}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{user.email}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{user.mobileNumber}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{user.role}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{user.formattedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
