/* eslint-disable */

import axios from "axios";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface ffModalSetOfType {
  selectedOrder: any;
  setModalOpen: (open: boolean) => void;
}
const FreefireOrderModal: React.FC<ffModalSetOfType> = (data) => {
  if (!data.selectedOrder.ffUid) {
    return;
  }
  const [status, setStatus] = useState<"pending" | "delivered" | "rejected">(
    // @ts-ignore
    data?.selectedOrder?.status
  );
  const [message, setMessage] = useState<string>(data.selectedOrder.message);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const handleOrder = async () => {
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/complete-fforder/${data.selectedOrder.id}`,
        {
          userId: userData.id,
          status: status,
          message: message,
        }
      );

      if (res) {
        setIsLoading(false);
        data.setModalOpen(false);
        toast.success("Order updated sucessfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("order update error");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Dim background but allow visibility */}
      <div className="absolute inset-0 bg-black opacity-[0.6] backdrop-blur-sm pointer-events-none" />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1f1f1f] rounded-xl border border-gray-700 shadow-2xl p-6 z-50 pointer-events-auto">
        <h1 className="text-2xl font-bold text-center text-red-500 mb-6">
          Update FF Order
        </h1>

        <div className="space-y-3 text-sm text-gray-300">
          <p>
            <span className="font-semibold text-white">Full Name:</span>{" "}
            <span className="text-green-400">{userData.fullName}</span>
          </p>
          <p>
            <span className="font-semibold text-white">FF UID:</span>{" "}
            <span className="text-green-400">{data.selectedOrder.ffUid}</span>
          </p>
          <p>
            <span className="font-semibold text-white">In-Game Name:</span>{" "}
            <span className="text-green-400">{data.selectedOrder.ffName}</span>
          </p>
          <p>
            <span className="font-semibold text-white">
              Diamond or M/W/LOF Type:
            </span>{" "}
            <span className="text-green-400">
              {data.selectedOrder.diamondTitle}
            </span>
          </p>
          <p>
            <span className="font-semibold text-white">Price:</span>{" "}
            <span className="text-green-400">
              {data.selectedOrder.diamondPrice}
            </span>
          </p>
        </div>

        {/* Message Input */}
        <div className="mt-6">
          <label className="text-white block mb-1 font-medium">Message</label>
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Enter your message here"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Status Select */}
        <div className="mt-4">
          <label className="text-white block mb-1 font-medium">
            Change Status
          </label>

          <select
            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "pending" | "delivered" | "rejected")
            }
          >
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => data.setModalOpen(false)}
            className="px-4 py-2 bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleOrder}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                <span>Processing...</span>
              </>
            ) : (
              "Update Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreefireOrderModal;
