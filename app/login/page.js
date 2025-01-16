"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import "./Login.css";
import Image from "next/image";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmitLogin = async (e) => {
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

  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        setError("");
        setIsRegistering(false);
        alert("Registration successful. You can now log in.");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred. Please try again.");
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

        {!isRegistering ? (
          <form onSubmit={handleSubmitLogin}>
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
            {/* <p className="toggle-form">
              Don't have an account?{" "}
              <span onClick={() => setIsRegistering(true)}>Register</span>
            </p> */}
          </form>
        ) : (
          <form onSubmit={handleSubmitRegister}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
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
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" className="login-button">
              Register
            </button>
            <p className="toggle-form">
              Already have an account?{" "}
              <span onClick={() => setIsRegistering(false)}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
