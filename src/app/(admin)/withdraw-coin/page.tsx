"use client";
/* eslint-disable */
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    setIsLoad(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/withdrawal-requests`
        );
        if (res?.data?.data) {
          setIsLoad(false);
          setData(res.data.data);
        }
      } catch (error) {
        setIsLoad(false);
        console.log(error);
      } finally {
        setIsLoad(false);
      }
    };
    fetchData();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="p-4 font-bold overflow-x-auto">
      <h1 className="pb-2 text-center text-3xl text-yellow-400">
        WITHDRAW COIN
      </h1>
      <table className="w-full mt-4 text-sm border border-gray-700 overflow-x-auto">
        <thead>
          <tr className="bg-yellow-700 text-white">
            <th className="border-2 px-4 py-1 text-left">Id</th>
            <th  className="border-2 px-4 py-1 text-left">fullName</th>
            <th className="border-2 px-4 py-1 text-left">Current Balance</th>
            <th className="border-2 px-4 py-1 text-left">Requested Amount</th>
            <th className="border-2 px-4 py-1 text-left">Image</th>
            <th className="border-2 px-4 py-1 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoad && (
            <tr>
              <td colSpan={6} className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border-2 px-4 py-1 text-left">{index}</td>
              <td  className="border-2 px-4 py-1 text-left">
                {item.user.fullName}
              </td>
              <td className="border-2 px-4 py-1 text-left">
                {item.user.balance}
              </td>
              <td className="border-2 px-4 py-1 text-left">{item.amount}</td>
              <td className="border-2 px-4 py-1 text-left">
                <img
                  src={item.qrScreenshot}
                  onClick={() => {
                    setSelectedImage(item.qrScreenshot);
                    toggleModal();
                  }}
                  alt="QR Screenshot"
                  className="w-16 h-16 object-cover cursor-pointer"
                />
              </td>
              <td className="border-2 px-4 py-1 text-left ">
              <button className={`px-2 cursor-pointer py-1 rounded ${item.status === 'pending' ? 'bg-yellow-500 text-white' : item.status === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {item.status}
              </button>

               
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && selectedImage && (
        <OpenModal image={selectedImage} isModalOpen={toggleModal} />
      )}
    </div>
  );
};

export default Page;

type OpenModalProps = {
  image: string;
  isModalOpen: () => void;
};

const OpenModal = ({ image, isModalOpen }: OpenModalProps) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <Image
          src={image}
          alt="QR Screenshot"
          width={400}
          height={400}
          className="object-contain"
        />
        <button
          onClick={isModalOpen}
          className="mt-2 cursor-pointer bg-red-500 text-white px-4 py-2 rounded absolute top-2 right-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};
