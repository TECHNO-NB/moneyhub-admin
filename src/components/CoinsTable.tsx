"use client";
/* eslint-disable */
import { useState } from "react";
import { User } from "@/app/(admin)/dashboard/page";
import { X } from "lucide-react";

type Props = {
  users: User[];
};

const CoinsTable = ({ users }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"add" | "remove">("add");
  const [coinValue, setCoinValue] = useState("");

  const openModal = (user: User, type: "add" | "remove") => {
    setSelectedUser(user);
    setActionType(type);
    setIsModalOpen(true);
    setCoinValue("");
  };

  const handleConfirm = () => {
    const value = parseInt(coinValue);
    if (isNaN(value) || value < 0) {
      alert("Please enter a valid non-negative number");
      return;
    }

    console.log(`User: ${selectedUser?.fullName}, Action: ${actionType}, Value: ${value}`);
    // 👉 Call your API or parent handler here

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
                  className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400"
                >
                  Add
                </button>
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => openModal(user, "remove")}
                  className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
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
              className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinsTable;
