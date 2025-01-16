import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../ArticleTable.css";
import { useSession } from "next-auth/react";
import Button from "../../../Button/Button";
import AddTypeForm from "../../../../components/Forms/Types/AddTypeForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashCan,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

export default function TypesTable() {
  const [types, setTypes] = useState([]);
  const [editType, setEditType] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [showDeleteTypeModal, setShowDeleteTypeModal] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const { data: session } = useSession();

  const fetchData = async () => {
    try {
      const [typesResponse] = await Promise.all([fetch("/api/types")]);
      const typesData = await typesResponse.json();
      setTypes(typesData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (type) => {
    setEditType(type.id);
    setFormData({ name: type.name });
  };

  const handleCancel = () => {
    setEditType(null);
  };

  const openDeleteTypeModal = (type) => {
    setTypeToDelete(type);
    setShowDeleteTypeModal(true);
  };

  const closeDeleteTypeModal = () => {
    setShowDeleteTypeModal(false);
  };

  const openTypeForm = () => setIsTypeFormOpen(true);
  const closeTypeForm = () => setIsTypeFormOpen(false);

  const handleTypeAdded = () => {
    fetchData();
    toast("Список Типов обновлен", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleSave = async () => {
    if (formData.name.trim() === "") {
      toast.error("Название не может быть пустым.");
      return;
    }

    try {
      const response = await fetch("/api/types", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editType, name: formData.name }),
      });

      if (response.ok) {
        const updatedType = await response.json();
        fetchData();
        setEditType(null);
        toast.success("Тип успешно обновлен");
      } else {
        const error = await response.json();
        toast.error(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Не удалось обновить тип");
    }
  };

  const handleTypeDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/types", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: typeToDelete.id }),
      });

      if (response.ok) {
        fetchData();
        toast("Тип удален", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        toast("Список Типов обновлен", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setShowDeleteTypeModal(false);
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
    <div>
      {isTypeFormOpen && (
        <AddTypeForm onClose={closeTypeForm} onTypeAdded={handleTypeAdded} />
      )}

      <div className="add-btn-conteiner">
        {session?.user.status === "Admin" && (
          <>
            <Button isActive={false} buttonClicked={openTypeForm}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </Button>
          </>
        )}
      </div>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-cell">Тип</th>
            {session?.user.status === "Admin" && (
              <th className="table-cell">Действие</th>
            )}
          </tr>
        </thead>
        <tbody className="table-body">
          {types.map((type) =>
            editType === type.id ? (
              <tr key={type.id} className="table-row">
                <td className="table-cell">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                  />
                </td>
                {session?.user.status === "Admin" && (
                  <td className="table-cell">
                    <button onClick={handleSave} className="action-button save">
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="action-button cancel"
                    >
                      Cancel
                    </button>
                  </td>
                )}
              </tr>
            ) : (
              <tr key={type.id} className="table-row">
                <td className="table-cell">{type.name}</td>
                {session?.user.status === "Admin" && (
                  <td className="table-cell">
                    <button
                      onClick={() => handleEdit(type)}
                      className="action-button edit"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => openDeleteTypeModal(type)}
                      className="action-button delete"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>

      {showDeleteTypeModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить тип "{typeToDelete.id}"? Это
              действие необратимо.
            </p>
            <div className="modal-actions">
              <button
                onClick={handleTypeDelete}
                className="modal-button confirm"
              >
                Да, удалить
              </button>
              <button
                onClick={closeDeleteTypeModal}
                className="modal-button cancel"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
