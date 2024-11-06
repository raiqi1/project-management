"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import AuthProvider from "./authProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    window.location.reload();
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);

    if (!savedToken) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // console.log("token from login", token);
  // console.log("token from Dashboard", token);

  return (
    <>
      <div className="absolute right-[50px] mt-2">
        {token && (
          <div className="flex gap-3 font-bold">
            <h1>Welcome {userName}</h1>
            <Button
              variant="contained"
              color="secondary"
              onClick={logoutHandler}
              size="small"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        <Sidebar />
        <main
          className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
            isSidebarCollapsed ? "" : "md:pl-64"
          }`}
        >
          <Navbar />
          {children}
        </main>
      </div>
    </>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
