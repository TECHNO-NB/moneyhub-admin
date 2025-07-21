"use client";
/* eslint-disable */
import { addUser, userState } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyUser() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user);
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const fetchUser = async () => {
      if (!userData || !userData.id) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/verify-user`
          );
          if (res.data.success) {
            const userData: userState = {
              id: res.data.data.id,
              avatar: res.data.data.avatar,
              fullName: res.data.data.fullName,
              email: res.data.data.email,
              balance: res.data.data.balance,
              role: res.data.data.role,
            };
            dispatch(addUser(userData));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUser();
  }, []);

  return null;
}
