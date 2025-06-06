"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faDollarSign,
  faUsers,
  faFileInvoiceDollar
} from "@fortawesome/free-solid-svg-icons";
import "./page.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import 'flowbite';
const menuItems = [
  { icon: faDollarSign, label: "Финансы", link: "/finances" },
  { icon: faFileInvoiceDollar, label: "Категории", link: "/articles" },
  { icon: faUsers, label: "Пользователи", link: "/users" },
];

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/login");
    return null;
  }
  return (
    <section>
      <div className="dashboard">
        {menuItems.map((item, index) => (
          <Link className="link" href={item.link} key={item.link}>
            <div className="dashboard-item" key={index}>
              <div className="dashboard-icon">
                <FontAwesomeIcon
                  icon={item.icon}
                  style={{ color: "#4f545a" }}
                />
              </div>
              <div className="dashboard-label">{item.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
