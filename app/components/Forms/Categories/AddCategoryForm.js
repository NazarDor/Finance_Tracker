"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../FormsStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CirclePicker } from "react-color";
import {
  faCoffee,
  faUser,
  faHome,
  faCar,
  faShoppingCart,
  faUtensils,
  faDollarSign,
  faWallet,
  faBook,
  faBriefcase,
  faHeart,
  faPlane,
  faGlobe,
  faMobileAlt,
  faLaptop,
  faBell,
  faMusic,
  faFilm,
  faGamepad,
  faTree,
  faMountain,
  faBicycle,
  faBasketballBall,
  faTools,
  faLightbulb,
  faCalendarAlt,
  faCamera,
  faTshirt,
  faBaby,
  faDog,
  faGraduationCap,
  faMapMarkerAlt,
  faShieldAlt,
  faRocket,
  faHandshake,
  faChartLine,
  faStar,
  faThumbsUp,
  faBuilding,
  faTreeCity,
  faGift,
  faClipboard,
  faPaw,
  faPhone,
  faMedkit,
  faAnchor,
  faWrench,
  faCogs,
  faBullhorn,
  faKey,
  faGlasses,
  faClipboardCheck,
  faStethoscope,
  faMap,
  faCode,
  faWifi,
  faTruck,
  faChartPie,
  faSnowflake,
  faMagic,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function AddCategoryForm({ onClose, onCategoryAdded }) {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState([]);
  const [icon, setIcon] = useState("");
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [iconColor, setIconColor] = useState("#000000");

  const icons = [
    faCoffee,
    faUser,
    faHome,
    faCar,
    faShoppingCart,
    faUtensils,
    faDollarSign,
    faWallet,
    faBook,
    faBriefcase,
    faHeart,
    faPlane,
    faGlobe,
    faMobileAlt,
    faLaptop,
    faBell,
    faMusic,
    faFilm,
    faGamepad,
    faTree,
    faMountain,
    faBicycle,
    faBasketballBall,
    faTools,
    faLightbulb,
    faCalendarAlt,
    faCamera,
    faTshirt,
    faBaby,
    faDog,
    faGraduationCap,
    faMapMarkerAlt,
    faShieldAlt,
    faRocket,
    faHandshake,
    faChartLine,
    faStar,
    faThumbsUp,
    faBuilding,
    faTreeCity,
    faGift,
    faClipboard,
    faPaw,
    faPhone,
    faMedkit,
    faAnchor,
    faWrench,
    faCogs,
    faBullhorn,
    faKey,
    faGlasses,
    faClipboardCheck,
    faStethoscope,
    faMap,
    faCode,
    faWifi,
    faTruck,
    faChartPie,
    faSnowflake,
    faMagic,
    faEnvelope,
  ];

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
        body: JSON.stringify({
          name,
          typeId: Number(typeId),
          iconClass: icon.iconName,
          iconColor,
        }),
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
        setIcon("");
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
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              required
            />
          </div>
          <div className="form-body">
            <div className="form-column">
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

            <div>
              <label>Icon</label>
              <div className="icon-selection">
                <button
                  type="button"
                  className="form-button"
                  onClick={() => setIsIconModalOpen(true)}
                >
                  {icon ? (
                    <FontAwesomeIcon
                      icon={icon}
                      style={{ color: iconColor, fontSize: "24px" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faHome}
                      style={{ color: iconColor, fontSize: "24px" }}
                    />
                  )}
                </button>
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

      {/* Модальное окно для выбора иконки */}
      {isIconModalOpen && (
        <div className="icon-modal">
          <div className="icon-modal-content">
            <h3>Выберите иконку</h3>
            <div className="icon-grid">
              {icons.map((icon, index) => (
                <button
                  key={index}
                  className="icon-button"
                  onClick={() => {
                    setIcon(icon); // Сохраняем выбранную иконку
                    setIsIconModalOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={icon} style={{ color: iconColor }} />
                </button>
              ))}
            </div>
            <div className="color-picker">
              <label>Выберите цвет</label>
              <CirclePicker
                color={iconColor}
                onChange={(color) => setIconColor(color.hex)} // Обновление выбранного цвета
              />
            </div>
            <button
              className="close-modal"
              onClick={() => setIsIconModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
