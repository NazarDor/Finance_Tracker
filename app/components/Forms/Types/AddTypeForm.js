"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import "../FormsStyle.css";

export default function AddTypeForm({ onClose, onTypeAdded }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        toast("Тип добавллен", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        onTypeAdded();
        setName("");
        onClose();
      } else {
        const error = await response.json();
        toast(`Ошибка: ${error.error}`, {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast("Что-то пошло не так.", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <h2 className="form-title">Add Type</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Добавить тип</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
