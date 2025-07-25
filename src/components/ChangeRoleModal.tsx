"use client";
import { ShieldAlert, Loader } from "lucide-react";
import { useState } from "react";

export default function ChangeRoleModal({
  userFullName,
  currentRole,
  onChange,
  onCancel,
  btnLoader,
}: {
  userFullName: string;
  currentRole: string;
  onChange: (role: "user" | "admin" | "subadmin") => void;
  onCancel: () => void;
  btnLoader: boolean;
}) {
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | "subadmin">(currentRole as any);

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
            {btnLoader ? (
              <div className="flex gap-1 items-center">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              "Change"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
