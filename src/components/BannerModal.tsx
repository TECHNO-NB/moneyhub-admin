"use client";
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface props {
  changeModalStatus: () => void;
}

const BannerModal = ({ changeModalStatus }: props) => {
  const [banner, setBanner] = useState<File | null | undefined | any>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [loader,setLoader]=useState<boolean>(false);

  const showImage = () => {
    const file = imgRef?.current?.files?.[0];
    if (file) {
      setBanner(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  // cleanup blob url when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const uploadImageToServer = async () => {
    try {
      const formData=new FormData();
     
      formData.append("banner",banner)
      setLoader(true);
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/add-banner`,
        
          formData,
        
        {

          headers:{
            "Content-Type":"multipart/form-data"
            
          }
        }
      );
      if (res.data) {
        setLoader(false);
        changeModalStatus()
        toast.success("SuccessFully uploaded");
      }
    } catch (error) {
      setLoader(false);
      toast.error("Failed to Upload")
      console.log(error);
    }finally{
      setLoader(false);
    }
  };
  return (
    <div className="fixed inset-0 max-w-full h-full flex items-center justify-center text-black px-4 ">
      <div className="div absolute inset-0 bg-black/50"></div>
      <div className="div relative flex flex-col items-center rounded-2xl w-full h-96 md:h-96 md:w-96 bg-white">
        <h1 className="text-bold text-3xl border-b-2 mt-2 font-bold text-yellow-400">
          Add Banner
        </h1>
        <label className=" cursor-pointer" htmlFor="img">
          <ImageUp color="red" size={50} />
        </label>
        <div>
          <input
            id="img"
            placeholder="Add image"
            className="hidden"
            ref={imgRef}
            type="file"
            accept="image/*"
            onChange={showImage}
          />
        </div>
        <div className="w-96 h-56 border-2 border-dashed rounded-2xl mt-2 overflow-hidden">
          {imageUrl ? null : (
            <h1 className="flex items-center justify-center h-full font-bold text-2xl">
              PREVIEW HERE
            </h1>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="btn absolute bottom-1 flex gap-2">
          <button
            className="border-2 bg-white rounded px-4 py-1 cursor-pointer"
            onClick={changeModalStatus}
          >
            Cancel
          </button>
          <button onClick={uploadImageToServer} className="border-2 bg-red-500 rounded px-4 py-1 cursor-pointer">
           {loader ? "Loading..." : "Confirm" }
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerModal;
