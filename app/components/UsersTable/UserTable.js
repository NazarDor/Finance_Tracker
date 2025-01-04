import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "./UserTable.css";
import { useSession } from "next-auth/react";

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

  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false); // Состояние для модального окна
  const [userToDelete, setUserToDelete] = useState(null); // Пользователь, которого нужно удалить

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
    setShowModal(false); // Закрываем модальное окно после удаления
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

  return (
    <div className="user-management-container">
      <h1 className="user-management-title">User Management</h1>
      <table className="user-table">
        <thead className="user-table-header">
          <tr>
            <th className="user-table-cell">Name</th>
            <th className="user-table-cell">Email</th>
            <th className="user-table-cell">Status</th>
            {session?.user.status === "Admin" && (
              <>
                <th className="user-table-cell">Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="user-table-body">
          {users.map((user) =>
            editUser === user.id ? (
              <tr key={user.id} className="user-table-row">
                <td className="user-table-cell">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="user-input"
                  />
                </td>
                <td className="user-table-cell">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="user-input"
                  />
                </td>
                <td className="user-table-cell">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="user-select"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Leader">Leader</option>
                    <option value="Church_member">Church Member</option>
                  </select>
                </td>
                <td className="user-table-cell">
                  <button
                    onClick={handleSave}
                    className="user-action-button save"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditUser(null)}
                    className="user-action-button cancel"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={user.id} className="user-table-row">
                <td className="user-table-cell">{user.name}</td>
                <td className="user-table-cell">{user.email}</td>
                <td className="user-table-cell">{user.status}</td>
                {session?.user.status === "Admin" && (
                  <>
                    <td className="user-table-cell">
                      <button
                        onClick={() => handleEdit(user)}
                        className="user-action-button edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="user-action-button delete"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>

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
