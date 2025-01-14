"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import "./Header.css";

export default function Header() {
  const { data: session } = useSession();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogoClick = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <header className="header">
      {session ? (
        <div className="auth-container">
          <div className="logo-container" onClick={handleLogoClick}>
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="Logo"
              className="logo"
            />
            <div className="user-info">
              <span className="user-name">{session.user.name || "User"}</span>
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <button onClick={() => signOut()} className="logout-button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-container">
          <button
            onClick={() =>
              signIn("github", { callbackUrl: "/", redirect: true })
            }
            className="login-button"
          >
            Sign in
          </button>
        </div>
      )}
    </header>
  );
}
