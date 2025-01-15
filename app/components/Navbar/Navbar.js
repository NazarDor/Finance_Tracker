"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDollarSign,
  faUsers,
  faFileInvoiceDollar,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLinkClick = () => setIsOpen(false);

  const menuItems = [
    { icon: faHome, label: "Гравная", link: "/" },
    { icon: faDollarSign, label: "Финансы", link: "/finances" },
    { icon: faFileInvoiceDollar, label: "Статьи", link: "/articles" },
    { icon: faUsers, label: "Пользователи", link: "/users" },
  ];

  return (
    <>
      <button className="burger" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      <nav className={`navbar ${isOpen ? "open" : ""}`}>
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <Link
                href={item.link}
                className={`menu-link ${
                  pathname === item.link ? "active" : ""
                }`}
                onClick={handleLinkClick}
              >
                <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                <span className="menu-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
