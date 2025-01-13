"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../FormsStyle.css";
import { useSession } from "next-auth/react";
import { Datepicker } from "flowbite-react";
import dayjs from "dayjs";

export default function AddArticleForm({ onClose, onArticleAdded }) {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState([]);

  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);

  const formattedDate = date ? new Date(date).toISOString() : null;
  const { data: session } = useSession();

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

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        toast("Не удалось загрузить категории", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      toast("Ошибка загрузки категорий.", {
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
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          typeId: Number(typeId),
          categoryId: Number(categoryId),
          amount: Number(amount),
          userId: session.user.id,
          date: formattedDate,
          description,
        }),
      });

      if (response.ok) {
        toast("Статья добавлена", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        onArticleAdded();
        setName("");
        setTypeId("");
        setCategoryId("");
        setAmount("");
        setDescription("");
        setDate("");
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
        <h2 className="form-title">Добавить статью</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-body">
            <div className="form-col">
              <div>
                <label className="form-label">Тип</label>
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

              <div>
                <label className="form-label">Категория</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Выберите категорию
                  </option>
                  {categories
                    .filter((category) => category.typeId === Number(typeId))
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
              <label className="form-label">Дата создания</label>
                <input
                  className="form-input"
                  type="date"
                  value={date || ""}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="form-col">
              <div>
                <label className="form-label">Название статьи</label>
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
                <label className="form-label">Описание статьи</label>
                <input
                  className="form-input"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Введите описание"
                />
              </div>

              <div>
                <label className="form-label">Сумма</label>
                <input
                  className="form-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Введите сумму"
                />
              </div>
            </div>
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
