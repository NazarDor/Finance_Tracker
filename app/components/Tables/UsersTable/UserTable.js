import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "./UserTable.css";
import { useSession } from "next-auth/react";
import AddUserForm from "../../Forms/User/AddUserForm";
import Button from "../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashCan,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    status: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleDelete = async () => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userToDelete.id }),
    });
    fetchUsers();
    toast.success("Пользователь удален", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setEditUser(user.id);
    setFormData(user);
  };

  const handleSave = async () => {
    await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setEditUser(null);
    fetchUsers();
    toast.success("Пользователь изменен", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleUserAdded = () => {
    fetchUsers();
    toast("Список пользователей обновлен", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const { data: session } = useSession();

  return (
    <div className="management-container">
      <div className="add-btn-conteiner">
        {session?.user.status === "Admin" && (
          <>
            <Button isActive={false} buttonClicked={openForm}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </Button>
          </>
        )}
      </div>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-cell">Name</th>
            <th className="table-cell">Email</th>
            <th className="table-cell">Status</th>
            {session?.user.status === "Admin" && (
              <>
                <th className="table-cell">Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="table-body">
          {users.map((user) =>
            editUser === user.id ? (
              <tr key={user.id} className="table-row">
                <td className="table-cell">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                  />
                </td>
                <td className="table-cell">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                </td>
                <td className="table-cell">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="select"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </td>
                <td className="table-cell">
                  <button onClick={handleSave} className="action-button save">
                    Save
                  </button>
                  <button
                    onClick={() => setEditUser(null)}
                    className="action-button cancel"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={user.id} className="table-row">
                <td className="table-cell">{user.name}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">{user.status}</td>
                {session?.user.status === "Admin" && (
                  <>
                    <td className="table-cell">
                      <button
                        onClick={() => handleEdit(user)}
                        className="action-button edit"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="action-button delete"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>

      {isFormOpen && (
        <AddUserForm onClose={closeForm} onUserAdded={handleUserAdded} />
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить пользователя {userToDelete?.name}?
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="modal-button confirm">
                Да, удалить
              </button>
              <button onClick={closeModal} className="modal-button cancel">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
