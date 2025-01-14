"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import "./Login.css";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image-container">
          <Image
            src="/logo.png"
            width={80}
            height={80}
            alt="Logo"
            className="login-image"
          />
        </div>
        <h1>ND-Studio</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
