"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import './loading-page.css';

export default function MainLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && router.pathname === "/login") {
      // Если пользователь уже аутентифицирован, но находится на странице логина
      router.push("/");
    }

    if (status === "unauthenticated" && router.pathname !== "/login") {
      // Если пользователь не аутентифицирован, но находится не на странице логина
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
          <Navbar />
          <main>{children}</main>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
