"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"; // Импортируем иконки
import "./Accordion.css"; // Подключаем стиль

export const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true); // Все аккордеоны открыты по умолчанию

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`accordion-item ${isOpen ? "open" : ""}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span className="accordion-icon">
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </span>
      </div>
      <div className="accordion-body">{isOpen && children}</div>
    </div>
  );
};

export const Accordion = ({ children }) => {
  return <div className="accordion">{children}</div>;
};
