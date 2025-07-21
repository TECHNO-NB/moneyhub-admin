"use client";
/* eslint-disable */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Loader, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface LoadBalance {
  id: string;
  paymentScreenshot: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  message: string;
  createdAt: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  balance: number;
  loadBalance: LoadBalance[];
}

const TABS = ["pending", "approved", "rejected"] as const;

const statusClasses: Record<any['status'], string> = {
  approved: 'text-green-600',
  rejected: 'text-red-600',
  pending:  'text-yellow-600',
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [selectedRequest, setSelectedRequest] = useState<{
    user: User;
    load: LoadBalance;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [loading, setLoading] = useState(false);

  // New state for image modal
  const [imageModal, setImageModal] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/check-payment`
      );
      setLoading(false);
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = users.flatMap((user) =>
    user.loadBalance
      .filter((lb) => lb.status === activeTab)
      .map((load) => ({
        user,
        load,
      }))
  );

  const openModal = (user: User, load: LoadBalance) => {
    setSelectedRequest({ user, load });
    setMessage(load.message);
    setNewStatus(load.status);
  };

  const updateStatus = async () => {
    try {
      axios.defaults.withCredentials = true;
      setIsLoading(true);
      const data = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/update-balance/${selectedRequest?.load.id}`,
        {
          status: newStatus,
          userId: selectedRequest?.user.id,
          paymentScreenshot: selectedRequest?.load.paymentScreenshot,
          message,
        }
      );
      if (data) {
        setIsLoading(false);
        setSelectedRequest(null);
        fetchData();
        toast.success("Screenshot valided successfully");
      }
    } catch (err) {
      console.error(err);
      toast.success("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="div flex  items-center justify-center gap-4 mb-6">
        <h1 className="text-3xl font-bold  text-center">Payment Requests</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          aria-label="Refresh notifications"
          className="text-yellow-400 cursor-pointer hover:text-yellow-300 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="flex justify-center mb-6 gap-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 cursor-pointer rounded-full font-medium capitalize transition ${
              activeTab === tab
                ? "bg-white text-black"
                : "bg-zinc-800 hover:bg-zinc-700 text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : filteredRows.length === 0 ? (
        <div className="text-center text-gray-500">
          No {activeTab} requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead className="bg-zinc-900 text-gray-300">
              <tr>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  User
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Current Balance
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Requested Amount
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Screenshot
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Status
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(({ user, load }) => (
                <tr
                  key={load.id}
                  className="border-b border-gray-800 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => openModal(user, load)}
                >
                  <td className="py-2 px-4">{user.fullName}</td>
                  <td className="py-2 px-4">{user.balance}</td>
                  <td className="py-2 px-4">{load.amount}</td>
                  <td className="py-2 px-4">
                    <img
                      src={load.paymentScreenshot}
                      alt="screenshot"
                      className="w-20 h-14 object-cover rounded shadow cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering row click modal
                        setImageModal(load.paymentScreenshot);
                      }}
                    />
                  </td>
                  <td className={`  ${statusClasses[load.status]} py-2 px-4 capitalize`}>{load.status}</td>
                  <td className="py-2 px-4 text-gray-400">
                    {new Date(load.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Update Modal */}
      <Dialog
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full z-50 relative text-white">
          <Dialog.Title className="text-xl font-bold mb-4">
            Update Status
          </Dialog.Title>
          {selectedRequest && (
            <>
              <p className="text-sm mb-1">
                User: {selectedRequest.user.fullName}
              </p>
              <p className="text-sm mb-1">
                Current Balance: {selectedRequest.user.balance}
              </p>
              <p className="text-sm mb-2">
                Amount Requested: {selectedRequest.load.amount}
              </p>
              <img
                src={selectedRequest.load.paymentScreenshot}
                alt="screenshot"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <label className="block mb-2 text-sm font-semibold">
                Message
              </label>
              <textarea
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 mb-4"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <label className="block mb-2 text-sm font-semibold">
                Change Status
              </label>
              <select
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 mb-4"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-600 px-4 py-2 rounded"
                  onClick={() => setSelectedRequest(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 px-4 py-2 cursor-pointer rounded font-semibold"
                  onClick={updateStatus}
                >
                  {isloading ? (
                    <div className="div  flex gap-1">
                      <Loader className="w-6 h-6 text-white font-semibold animate-spin" />
                      <p>Loading...</p>
                    </div>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </Dialog>

      {/* Screenshot Viewer Modal */}
      <Dialog
        open={!!imageModal}
        onClose={() => setImageModal(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="relative z-50 max-w-4xl w-full p-4 flex justify-center">
          <img
            src={imageModal!}
            alt="Full Screenshot"
            className="max-h-[80vh] w-auto object-contain rounded-lg shadow-lg"
          />
          <button
            className="absolute top-4 right-6 text-white text-3xl bg-black/60 rounded-full px-3 py-1 hover:bg-black/80 transition"
            onClick={() => setImageModal(null)}
            aria-label="Close image preview"
          >
            ✕
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default Page;
