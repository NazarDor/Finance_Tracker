"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.pathname === "/login") {
      router.push("/");
    }

    if (status === "unauthenticated" && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div>
      {session ? (
        <>
          <Header />
          <div className="main">
            <Navbar />
            <main className="container">{children}</main>
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
