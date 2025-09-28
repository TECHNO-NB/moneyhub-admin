"use client";
/* eslint-disable */
import React, { useEffect, useState } from "react";
import BannerModal from "@/components/BannerModal";
import Image from "next/image";
import axios from "axios";

const page = () => {
  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const [data, setData] = useState([]);

  const changeModalStatus = () => {
    setIsModalShow(!isModalShow);
  };

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-all-banner`
        );

        setData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllImages();
  }, []);
  return (
    <div className="px-4 md:px-10">
      {isModalShow && <BannerModal changeModalStatus={changeModalStatus} />}
      <h1 className="text-2xl text-yellow-400 text-center mt-4 font-bold">
        Add Banner
      </h1>
      <div className="w-full flex justify-end ">
        <button
          onClick={changeModalStatus}
          className="bg-red-600 border px-2 py-1 rounded-sm cursor-pointer hover:bg-red-400"
        >
          Add Banner
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mt-6 w-full">
        {data &&
          data.map((val: any, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
              {/* Delete button - appears on hover */}
              <button className="  cursor-pointer z-10 absolute top-2 right-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm transition">
                Delete
              </button>

              {/* Image */}
              <div className="w-full h-72">
                <Image
                  className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition duration-300"
                  width={500}
                  height={500}
                  src={val?.image}
                  alt="Image"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default page;
