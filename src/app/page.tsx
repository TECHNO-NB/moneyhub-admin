"use client";
/* eslint-disable */
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store"; // adjust to your store path

const page = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Admin Panel</h1>
        <p className="text-lg text-gray-600">
          You are logged in as:{" "}
          <span
            className={`font-semibold ${
              user.role === "admin"
                ? "text-green-600"
                : user.role === "subadmin"
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          >
            {user.role || "User"}
          </span>
        </p>

        {/* Optional: conditional UI based on role */}
        <div className="mt-6">
          {user.role === "admin" && (
            <div className="p-4 bg-green-100 border border-green-400 rounded-md text-green-700">
              Full access granted. You can manage users, orders, and system settings.
            </div>
          )}
          {user.role === "subadmin" && (
            <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md text-yellow-700">
              Limited access. You can review screenshots and approve orders.
            </div>
          )}
          {!user.role && (
            <div className="p-4 bg-blue-100 border border-blue-400 rounded-md text-blue-700">
              Role not found. Please contact support.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
