import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="px-4">
      <h1 className="text-2xl font-extrabold mt-4 mb-4 underline underline-yellow-400">FreeFire</h1>
      <ul className="flex gap-4 items-center justify-center flex-wrap">
        <Link className="bg-yellow-400  text-xl px-2 py-2 hover:bg-red-300 font-semibold rounded-lg" href="/freefireorder">FreeFire Order</Link>
        <Link className="bg-yellow-400 text-xl px-2 py-2 hover:bg-red-300 font-semibold rounded-lg" href="/fftopuplist">FreeFire TopUp List</Link>
        <Link className="bg-yellow-400 text-xl px-2 py-2 hover:bg-red-300 font-semibold rounded-lg" href="/fftournament">FreeFire TournaMent</Link>
      </ul>
    </div>
  );
};

export default page;
