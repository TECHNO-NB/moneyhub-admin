/* eslint-disable */
import React from "react";
import Link from "next/link";

const page = () => {
  const links = [
    { href: "/freefireorder", label: "FreeFire Order" },
    { href: "/fftopuplist", label: "FreeFire TopUp List" },
    { href: "/fftournament", label: "Create FreeFire Tournament" },
    { href: "/managetournament", label: "Manage Already Created Tournament" },
  ];

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mt-4 mb-8">
        <span className="relative inline-block text-black">
          FreeFire
          <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
        </span>
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-yellow-400 text-gray-900 text-lg md:text-xl font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-yellow-500 transition-all duration-300 ease-out"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
