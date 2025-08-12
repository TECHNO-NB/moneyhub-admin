"use client";
/* eslint-disable */

import { useEffect, useState } from "react";
import clsx from "clsx";
import FreefireOrderModal from "@/components/FreefireOrderModal";
import axios from "axios";

import { RefreshCw } from "lucide-react";

export interface FFOrder {
  id: string;
  user: any;
  ffUid: number;
  ffName: string;
  diamondTitle: string;
  diamondPrice: number;
  status: "pending" | "approved" | "rejected" | "delivered";
  message: string;
  createdAt: string;
}

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedUser] = useState<FFOrder>();
  // const userData = useSelector((state: any) => state.user);
  const [orders, setOrders] = useState<FFOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "pending" | "delivered" | "rejected"
  >("pending");

  const getALlOrder = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/get-allfforder/`
      );
      if (data) {
        setOrders(data.data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getALlOrder();
  }, []);

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <main className="py-4 px-4">
      {isModalOpen && selectedOrder && (
        <FreefireOrderModal
          selectedOrder={selectedOrder}
          setModalOpen={setIsModalOpen}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Free Fire Orders</h1>
        <button
          onClick={getALlOrder}
          disabled={loading}
          aria-label="Refresh orders"
          className="text-yellow-400 cursor-pointer hover:text-yellow-300 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["pending", "delivered", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status as any)}
            className={clsx(
              "px-4 py-2 rounded-full font-medium capitalize text-sm",
              activeTab === status
                ? "bg-yellow-400 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">User</th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Freefire UID
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Freefire Name
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Diamonds Or W/M/LOP
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Current Balance
              </th>
              <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: FFOrder) => (
                <tr
                  key={order.ffUid + order.createdAt}
                  className="border-t hover:bg-red-400 transition duration-150"
                >
                  <td className="px-4 py-3">{order.user.fullName}</td>
                  <td className="px-4 py-3">{order.ffUid}</td>
                  <td className="px-4 py-3">{order.ffName}</td>
                  <td className="px-4 py-3">{order.diamondTitle}</td>
                  <td className="px-4 py-3">{order.diamondPrice}</td>
                  <td className="px-4 py-3">{order.user.balance}</td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() => {
                        setIsModalOpen(true);
                        setSelectedUser(order);
                      }}
                      className={clsx(
                        "px-2 py-1 rounded-full text-xs font-semibold cursor-pointer",
                        {
                          "bg-yellow-100 text-yellow-700":
                            order.status === "pending",
                          "bg-green-300 text-green-700":
                            order.status === "delivered",
                          "bg-red-100 text-red-700":
                            order.status === "rejected",
                        }
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No {activeTab} orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default page;
