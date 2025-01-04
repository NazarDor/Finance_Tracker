"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import UserTable from "../components/UsersTable/UserTable";
import AddUserForm from "../components/Forms/AddUserForm";
import "./style.css";
import { useSession } from "next-auth/react";

export default function Users() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const { data: session } = useSession();

  const handleUserAdded = () => {
    toast("Список пользователей обновлен", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <section>
      <div className="user-page">
        <div className="add-user-btn-conteiner">
          {session?.user.status === "Admin" && (
            <>
              <button onClick={openForm} className="add-user-btn">
                Добавить пользователя
              </button>
            </>
          )}
        </div>

        <UserTable />

        {isFormOpen && (
          <AddUserForm onClose={closeForm} onUserAdded={handleUserAdded} />
        )}
      </div>
    </section>
  );
}
