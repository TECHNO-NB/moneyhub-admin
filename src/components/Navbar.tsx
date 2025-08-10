"use client";
/* eslint-disable */

import React, { useState } from "react";
import {
  Home,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  List,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNavbar = () => {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      icon: <Home size={18} />,
      href: "/dashboard",
    },
    {
      name: "Screenshot-Check",
      icon: <Users size={18} />,
      href: "/screenshot-check",
    },
    {
      name: "Freefire",
      icon: <Gamepad2 size={18} />,
      href: "/freefire",
    },
   
  ];

  const isActive = (href: string) => path === href;

  return (
    <nav className="bg-black text-white border-b shadow-md px-4 md:px-8 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-yellow-400">
          <Link href="/">Admin Panel</Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map(({ name, icon, href }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 transition font-medium ${
                isActive(href) ? "text-yellow-400" : "text-white hover:text-yellow-400"
              }`}
            >
              {icon} {name}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logout Button (Desktop Only) */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center text-red-500 hover:text-red-600 transition">
            <LogOut size={20} />
            <span className="ml-1 hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          {navLinks.map(({ name, icon, href }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block px-2 py-2 rounded-md transition font-medium ${
                isActive(href) ? "text-yellow-400" : "text-white hover:text-yellow-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {icon} {name}
              </div>
            </Link>
          ))}

          <button className="flex items-center text-red-500 hover:text-red-600 transition mt-2">
            <LogOut size={20} />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
