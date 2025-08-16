"use client";
/* eslint-disable */
import axios from "axios";
import { XCircle, Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MakeWinnerModal({
  onCancel,
  winnerId,
}: {
  winnerId: string | any;
  onCancel: () => void;
}) {
  const [btnLoader, setIsBtnLoad] = useState(false);
  const handleWinner = async () => {
    setIsBtnLoad(true);

    try {
      
      axios.defaults.withCredentials = true;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/make-winner/${winnerId}`
      );
      if (res.data) {
        setIsBtnLoad(false);
        toast.success("Winner updated successfully");
      }
    } catch (error) {
      console.error(error);
      setIsBtnLoad(false);
      toast.error("error on update winner");
    } finally {
      setIsBtnLoad(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center gap-3">
          <XCircle className="text-red-600 w-8 h-8" />
          <h2 className="text-xl font-semibold text-gray-800">
            Confirm Make Winner
          </h2>
        </div>
        <div className="text-gray-600">
          Are you sure you want to Make him Winner
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleWinner}
            className="px-4 py-2 cursor-pointer rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {btnLoader ? (
              <div className="flex gap-1 items-center">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              "Yes, Make Winner"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
