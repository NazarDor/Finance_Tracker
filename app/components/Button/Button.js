"use client";
import "./Button.css";

export default function Button({ children, buttonClicked, isActive }) {
  return (
    <button
      className={isActive ? "button active" : "button"}
      onClick={buttonClicked}
    >
      {children}
    </button>
  );
}
