"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserTie,
  faCog,
  faDollarSign,
  faUsers,
  faCalendarDays,
  faFileInvoiceDollar
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const menuItems = [
    { icon: faHome, label: "Головна", link: "/" },
    { icon: faUserTie, label: "Служителі", link: "/leaders" },
    { icon: faDollarSign, label: "Фінанси", link: "/finances" },
    { icon: faUsers, label: "Користувачі", link: "/users" },
    { icon: faCalendarDays, label: "Календар", link: "/calendar" },
    { icon: faFileInvoiceDollar, label: "Статті", link: "/articles" },
    { icon: faCog, label: "Налаштування", link: "/settings" },
  ];

  return (
    <nav
      className={`navbar ${isOpen ? "open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <Link
              href={item.link}
              className={`menu-link ${pathname === item.link ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              <span className="menu-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
