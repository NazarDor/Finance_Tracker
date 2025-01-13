"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../FormsStyle.css";

export default function AddCategoryForm({ onClose, onCategoryAdded }) {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState([]);

  const fetchTypes = async () => {
    try {
      const response = await fetch("/api/types");
      if (response.ok) {
        const data = await response.json();
        setTypes(data);
      } else {
        toast("Не удалось загрузить типы", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки типов:", error);
      toast("Ошибка загрузки типов.", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, typeId: Number(typeId) }),
      });

      if (response.ok) {
        toast("Категория добавлена", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        onCategoryAdded();
        setName("");
        setTypeId("");
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
      console.error("Ошибка при добавлении категории:", error);
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
        <h2 className="form-title">Добавить категорию</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Название категории</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              required
            />
          </div>

          <div>
            <label>Тип</label>
            <select
              className="form-select"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              required
            >
              <option value="" disabled>
                Выберите тип
              </option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit">Добавить</button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
