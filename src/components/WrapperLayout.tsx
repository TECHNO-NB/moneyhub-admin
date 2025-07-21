"use client";
/* eslint-disable */
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import AdminNavbar from "./Navbar";

export const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AdminNavbar />
      {children}
    </Provider>
  );
};
