"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import "./Header.css";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="header">
      <div className="logo-container">
        <Image
          src="/logo.png"
          width={50}
          height={50}
          alt="Logo"
          className="logo"
        />
        <h1 className="header-title">Church</h1>
      </div>

      <div className="auth-container">
        {session ? (
          <div className="user-info">
            <Image
              src={session.user.image || "/logo.png"}
              width={40}
              height={40}
              alt="User Avatar"
              className="avatar"
            />
            <span className="user-name">{session.user.name || "User"}</span>
            <button onClick={() => signOut()} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() =>
              signIn("github", { callbackUrl: "/", redirect: true })
            }
            className="login-button"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
