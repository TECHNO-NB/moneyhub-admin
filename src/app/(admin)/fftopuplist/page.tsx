"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Topup {

  diamondTitle: string;
  price: number;
  realPrice: number;
}

const Page = () => {
  const [data, setData] = useState<Topup[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-topup-list`
        );
        setData(res.data.data); // assuming backend sends { data: [...] }
      } catch (error) {
        console.error("Error fetching top-up list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (index: number, field: keyof Topup, value: string | number) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    setData(updated);
  };

  // Add new row
  const handleAdd = () => {
   
    setData([
      ...data,
      {diamondTitle: "", price: 0, realPrice: 0 },
    ]);
  };

  // Delete row
  const handleDelete = (index: number) => {
    const updated = data.filter((_, idx) => idx !== index);
    setData(updated);
  };

  // Save to DB with PATCH
  const handleSave = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/add-ff-toupup-rate`,
        { data }
      );
      toast.success("Top-up list saved ✅");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save ❌");
    }
  };

  if (loading) return <p className=" flex items-center justify-center h-full mt-40 text-2xl"> Loading...</p>;

  return (
    <div className="px-2 md:px-20 py-5 md:py-10">
      <div className="head flex flex-col items-center">
        <h1 className="font-semibold text-3xl text-center border-b-2 border-yellow-400">
          FreeFire TOPUP List
        </h1>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAdd}
            className="bg-red-600 cursor-pointer px-4 py-1 rounded-xl font-semibold hover:bg-red-400"
          >
            Add Row
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 cursor-pointer px-4 py-2 rounded-xl font-semibold hover:bg-green-400"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-y-scroll scrollbar-hide h-[500px]">
        <table className="w-full border border-gray-400">
          <thead>
            <tr className="bg-gray-200 text-left text-black">
             
              <th className="border px-2 py-1">Diamond Title</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Real Price</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
               
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={item.diamondTitle}
                    onChange={(e) =>
                      handleChange(idx, "diamondTitle", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleChange(idx, "price", Number(e.target.value))
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={item.realPrice}
                    onChange={(e) =>
                      handleChange(idx, "realPrice", Number(e.target.value))
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleDelete(idx)}
                    className="bg-gray-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
