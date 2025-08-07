"use client";
/* eslint-disable */
import { addUser, userState } from "@/redux/userSlice";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyUser() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState <boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    axios.defaults.withCredentials = true;
    const fetchUser = async () => {
      if (!userData || !userData.id) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/verify-user`
          );
          if (res.data.success) {
            setIsLoading(false)
            const userData: userState = {
              id: res.data.data.id,
              avatar: res.data.data.avatar,
              fullName: res.data.data.fullName,
              email: res.data.data.email,
              balance: res.data.data.balance,
              role: res.data.data.role,
            };
            dispatch(addUser(userData));
            toast.success(`Welcome back ${res.data.data.fullName}`);
          }
        } catch (error) {
          console.log(error);
          toast.error("Login Now");
           setIsLoading(false)
        }finally{
          setIsLoading(false)
        }
      }
    };
    fetchUser();
  }, []);

  return ( 
    <div className="fixed left-1/2 top-1/2">
    { isLoading ? (
      <Loader size={50} className=" animate-spin"/> 
    ): null }
    </div>
  );
}
