"use client";
/* eslint-disable */

import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Coins,
  XCircle,
  ShieldAlert,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";

import axios from "axios";

type User = {
  id: string;
  fullName: string;
  email: string;
  balance: number;
  role: "user" | "admin" | "subadmin";
};

const DeleteModal = ({
  userFullName,
  userRole,
  onConfirm,
  onCancel,
}: {
  userFullName: string;
  userRole: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center gap-3">
          <XCircle className="text-red-600 w-8 h-8" />
          <h2 className="text-xl font-semibold text-gray-800">
            Confirm Delete
          </h2>
        </div>
        <div className="text-gray-600">
          Are you sure you want to delete <b>{userFullName}</b> (
          <span className="capitalize">{userRole}</span>)?
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangeRoleModal = ({
  userFullName,
  currentRole,
  onChange,
  onCancel,
}: {
  userFullName: string;
  currentRole: string;
  onChange: (role: "user" | "admin" | "subadmin") => void;
  onCancel: () => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<
    "user" | "admin" | "subadmin"
  >(currentRole as any);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-black border-2 text-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-yellow-600 w-8 h-8" />
          <h2 className="text-xl font-semibold">Change Role</h2>
        </div>
        <p className="mb-3">
          Change role for <b>{userFullName}</b>:
        </p>
        <select
          defaultValue={currentRole}
          onChange={(e) => setSelectedRole(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-black text-white"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="subadmin">Subadmin</option>
        </select>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onChange(selectedRole)}
            className="px-4 py-2 rounded-xl bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "coins">("users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [coinInput, setCoinInput] = useState<{ [key: string]: number }>({});

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const fetchAllUserData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const getAllUser = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/get-alluser`
      );
      if (getAllUser.data.success) {
        setUsers(getAllUser.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/delete-user/${id}`
      );
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleRoleUpdate = async (id: string, newRole: User["role"]) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/update-role/${id}`,
        { role: newRole }
      );
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
      setShowRoleModal(false);
    } catch (err) {
      console.error("Role update failed", err);
    }
  };

  const handleCoinUpdate = async (id: string, action: "add" | "remove") => {
    const value = coinInput[id];
    if (!value || value <= 0) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/${action}-balance/${id}`;
      await axios.post(url, { amount: value });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                balance:
                  action === "add"
                    ? user.balance + value
                    : Math.max(0, user.balance - value),
              }
            : user
        )
      );

      setCoinInput((prev) => ({ ...prev, [id]: 0 }));
    } catch (error) {
      console.error("Coin update failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 max-w-screen-xl mx-auto">
      <div className="flex gap-6 items-center mb-6">
        <h1 className="text-3xl text-yellow-400 font-bold ">
          Admin Dashboard
        </h1>
        <button
          onClick={fetchAllUserData}
          disabled={loading}
          aria-label="Refresh notifications"
          className="text-yellow-400 cursor-pointer hover:text-yellow-300 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl ${
            activeTab === "users" ? "bg-gray-700" : "bg-gray-800"
          }`}
        >
          <UserIcon className="inline mr-2" size={16} /> Manage Users
        </button>
        <button
          onClick={() => setActiveTab("coins")}
          className={`px-4 py-2 rounded-xl ${
            activeTab === "coins" ? "bg-gray-700" : "bg-gray-800"
          }`}
        >
          <Coins className="inline mr-2" size={16} /> Manage Coins
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by full name..."
        className="w-full max-w-md mb-6 p-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="overflow-x-auto rounded-xl bg-gray-900 p-4">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-800 text-sm uppercase text-gray-300">
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Balance</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Change Role</th>
                <th className="px-4 py-2">Remove User</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.balance}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-xl hover:bg-blue-700"
                      >
                        Change
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="bg-orange-600 font-semibold px-4 py-1 rounded-2xl hover:bg-orange-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Coins Tab */}
      {activeTab === "coins" && (
        <div className="overflow-x-auto rounded-xl bg-gray-900 p-4">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-800 text-sm uppercase text-gray-300">
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Current Balance</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Add</th>
                <th className="px-4 py-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.balance}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      className="w-24 p-1 rounded bg-black border border-gray-600 text-white"
                      value={coinInput[user.id] || ""}
                      onChange={(e) =>
                        setCoinInput((prev) => ({
                          ...prev,
                          [user.id]: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleCoinUpdate(user.id, "add")}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                    >
                      <Plus size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleCoinUpdate(user.id, "remove")}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      <Minus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && selectedUser && (
        <DeleteModal
          userFullName={selectedUser.fullName}
          userRole={selectedUser.role}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteUser(selectedUser.id)}
        />
      )}

      {showRoleModal && selectedUser && (
        <ChangeRoleModal
          userFullName={selectedUser.fullName}
          currentRole={selectedUser.role}
          onCancel={() => setShowRoleModal(false)}
          onChange={(newRole) => handleRoleUpdate(selectedUser.id, newRole)}
        />
      )}
    </div>
  );
}
