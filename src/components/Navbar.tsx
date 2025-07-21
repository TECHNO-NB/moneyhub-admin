"use client";
/* eslint-disable */

import React from "react";
import { Home, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNavbar = () => {
  const path = usePathname();
  return (
    <nav className="bg-black text-white border-b-2 shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-yellow-400">
        <Link href="/admin">Admin Panel</Link>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-6">
        <Link
          href="/dashboard"
          className={`${
            path === "/dashboard" ? "text-yellow-400" : "text-white"
          } flex items-center gap-1  transition`}
        >
          <Home size={18} /> Dashboard
        </Link>
        <Link
          href="/screenshot-check"
          className={`${
            path === "/screenshot-check" ? "text-yellow-400" : "text-white"
          } flex items-center gap-1  transition`}
        >
          <Users size={18} /> ScreenShot-Check
        </Link>
        <Link
          href="/freefireorder"
          className="flex items-center gap-1 text-white  transition"
        >
          <Settings size={18} />
          Freefire Order
        </Link>
      </div>

      {/* Account Section */}
      <div className="flex items-center gap-4">
        <button className="flex items-center text-red-500 hover:text-red-700 transition">
          <LogOut size={20} />
          <span className="ml-1 hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
