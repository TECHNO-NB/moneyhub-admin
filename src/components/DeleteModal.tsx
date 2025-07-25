"use client";
/* eslint-disable */
import { XCircle, Loader } from "lucide-react";

export default function DeleteModal({
  userFullName,
  userRole,
  onConfirm,
  onCancel,
  btnLoader,
}: {
  userFullName: string;
  userRole: string;
  onConfirm: () => void;
  onCancel: () => void;
  btnLoader: boolean;
}) {
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
            {btnLoader ? (
              <div className="flex gap-1 items-center">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
