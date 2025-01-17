"use client";

import { useState } from "react";
import AddArticleForm from "../Forms/Articles/AddArticleForm";
import "./GlobalButtons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

export default function GlobalButtons() {
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const openArticleForm = (type) => {
    setSelectedType(type);
    setIsArticleFormOpen(true);
  };

  const closeArticleForm = () => {
    setIsArticleFormOpen(false);
    setSelectedType("");
  };

  const handleArticleAdded = () => {
    toast("Список статей обновлен", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    closeArticleForm();
  };

  return (
    <div>
      <div className="buttons-container">
        <button className="income" onClick={() => openArticleForm(1)}>
          <FontAwesomeIcon className="button-icon" icon={faCirclePlus} />
        </button>
        <button className="exept" onClick={() => openArticleForm(2)}>
          <FontAwesomeIcon className="button-icon" icon={faCircleMinus} />
        </button>
      </div>
      {isArticleFormOpen && (
        <AddArticleForm
          onClose={closeArticleForm}
          onArticleAdded={handleArticleAdded}
          initialType={selectedType}
        />
      )}
    </div>
  );
}
