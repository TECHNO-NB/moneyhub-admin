/* eslint-disable */

import React from "react";
import axios from "axios";

interface BannerDeleteModalProps {
  bannerId: string;
  onCancel: () => void;
  onDeleted: () => void; // 👈 callback after successful delete
}

const BannerDeleteModal: React.FC<BannerDeleteModalProps> = ({
  bannerId,
  onCancel,
  onDeleted,
}) => {
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/delete-banner/${bannerId}`
      );

      onDeleted(); // tell parent to refresh or remove banner
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
      <div className="bg-white p-6  rounded-xl shadow-lg w-[400px]">
        <h2 className="text-lg  font-bold mb-4">Confirm Delete</h2>
        <p className=" relative">Are you sure you want to delete this banner?</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerDeleteModal;
