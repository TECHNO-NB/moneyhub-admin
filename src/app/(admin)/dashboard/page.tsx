"use client";
/* eslint-disable */
import { useEffect, useState } from "react";
import { RefreshCw, User as UserIcon, Coins } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import DeleteModal from "@/components/DeleteModal";
import ChangeRoleModal from "@/components/ChangeRoleModal";
import UserTable from "@/components/UserTable";
import CoinsTable from "@/components/CoinsTable";

export type User = {
  id: string;
  fullName: string;
  email: string;
  balance: number;
  role: "user" | "admin" | "subadmin";
};

export default function page() {
  const [activeTab, setActiveTab] = useState<"users" | "coins">("users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [coinInput, setCoinInput] = useState<{ [key: string]: number }>({});
  const [btnLoader, setBtnLoader] = useState<boolean>(false);

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
      setBtnLoader(true);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/delete-user/${id}`
      );
      if (res.data) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        setShowDeleteModal(false);
        toast.success("Successfully deleted user");
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Error deleting user");
    } finally {
      setBtnLoader(false);
    }
  };

  const handleRoleUpdate = async (id: string, newRole: User["role"]) => {
    try {
      setBtnLoader(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/change-role/${id}`,
        { newRole }
      );
      if (res.data) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
        setShowRoleModal(false);
        toast.success("Role updated successfully");
      }
    } catch (err) {
      console.error("Role update failed", err);
      toast.error("Error updating role");
    } finally {
      setBtnLoader(false);
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
        <h1 className="text-3xl text-yellow-400 font-bold">Admin Dashboard</h1>
        <button
          onClick={fetchAllUserData}
          disabled={loading}
          aria-label="Refresh users"
          className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
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

      {activeTab === "users" && (
        <UserTable
          users={filteredUsers}
          // @ts-ignore
          loading={loading}
          onDeleteClick={(user) => {
            setSelectedUser(user);
            setShowDeleteModal(true);
          }}
          onChangeRoleClick={(user) => {
            setSelectedUser(user);
            setShowRoleModal(true);
          }}
        />
      )}

      {activeTab === "coins" && (
        <CoinsTable
        // @ts-ignore
          users={filteredUsers}
          // coinInput={coinInput}
          // onChange={(id:any, value:any) =>
            // setCoinInput((prev) => ({ ...prev, [id]: value }))
          // }
          // onCoinAction={handleCoinUpdate}
        />
       
      )}

      {showDeleteModal && selectedUser && (
        <DeleteModal
          userFullName={selectedUser.fullName}
          userRole={selectedUser.role}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteUser(selectedUser.id)}
          btnLoader={btnLoader}
        />
      )}

      {showRoleModal && selectedUser && (
        <ChangeRoleModal
          userFullName={selectedUser.fullName}
          currentRole={selectedUser.role}
          onCancel={() => setShowRoleModal(false)}
          onChange={(newRole) => handleRoleUpdate(selectedUser.id, newRole)}
          btnLoader={btnLoader}
        />
      )}
    </div>
  );
}
