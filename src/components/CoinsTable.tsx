"use client";
/* eslint-disable */
import { useState } from "react";
import { User } from "@/app/(admin)/dashboard/page";
import { Loader, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  users: User[];
};

const CoinsTable = ({ users }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"add" | "remove">("add");
  const [coinValue, setCoinValue] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const openModal = (user: User, type: "add" | "remove") => {
    setSelectedUser(user);
    setActionType(type);
    setIsModalOpen(true);
    setCoinValue("");
  };

  const handleConfirm = async () => {
    const value = parseInt(coinValue);
    if (isNaN(value) || value < 0) {
      alert("Please enter a valid non-negative number");
      return;
    }

    if (actionType === "add") {
      setLoading(true);
      // add coin
      try {
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/add-coin/${selectedUser?.id}`,
          {
            coin: value,
          }
        );
        if (res.data) {
          setLoading(false);
          toast.success("Coin added successfully");
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Failed to add coin");
      }
    } else {
      //remove user from coins
      try {
        setLoading(true);
        if (!selectedUser) return;
        if (selectedUser?.balance < value) {
          toast.error("coin is negative")
          setLoading(false);
          return;
        }
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/remove-coin/${selectedUser?.id}`,
          {
            coin: value,
          }
        );
        if (res.data) {
          setLoading(false);
          toast.success("Coin removed successfully");
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Failed to remove coin");
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm border border-gray-700 text-white">
        <thead className="bg-zinc-800 text-gray-300">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-center">Current Balance</th>
            <th className="p-3 text-center">Add Coin</th>
            <th className="p-3 text-center">Remove Coin</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-900">
          {users?.map((user, index) => (
            <tr key={user.id} className="border-t border-zinc-700">
              <td className="p-3 text-center">{index + 1}</td>
              <td className="p-3">{user.fullName}</td>
              <td className="p-3 text-center">{user.balance}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => openModal(user, "add")}
                  className="bg-green-500 cursor-pointer px-4 py-2 rounded-lg hover:bg-green-400"
                >
                  Add
                </button>
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => openModal(user, "remove")}
                  className="bg-red-500 cursor-pointer px-4 py-2 rounded-lg hover:bg-red-400"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-zinc-900 p-6 rounded-lg w-[90%] max-w-sm text-white relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {actionType === "add" ? "Add Coins" : "Remove Coins"}
            </h2>
            <p className="mb-2">User: {selectedUser?.fullName}</p>
            <input
              type="number"
              min={0}
              value={coinValue}
              onChange={(e) => setCoinValue(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded bg-zinc-800 text-white border border-zinc-700"
              placeholder="Enter coin amount"
            />
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-500 py-2 rounded"
            >
              {isLoading ? (
                <div className="flex  justify-center gap-1 items-center">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinsTable;
