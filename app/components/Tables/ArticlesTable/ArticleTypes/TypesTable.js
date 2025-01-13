import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../ArticleTable.css";
import { useSession } from "next-auth/react";
import Button from "../../../Button/Button";
import AddTypeForm from "../../../../components/Forms/Types/AddTypeForm";

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

  // Сохранение изменений
  const handleSave = () => {
    if (formData.name.trim() === "") {
      toast.error("Название не может быть пустым.");
      return;
    }

    setTypes((prevTypes) =>
      prevTypes.map((type) =>
        type.id === editType ? { ...type, name: formData.name } : type
      )
    );
    setEditType(null);
    toast.success("Тип успешно обновлен");
  };

  // Отмена редактирования
  const handleCancel = () => {
    setEditType(null);
  };

  // Открытие модального окна удаления
  const openDeleteTypeModal = (type) => {
    setTypeToDelete(type);
    setShowDeleteTypeModal(true);
  };

  // Закрытие модального окна удаления
  const closeDeleteTypeModal = () => {
    setShowDeleteTypeModal(false);
  };

  // Удаление типа
  const handleTypeDelete = () => {
    setTypes((prevTypes) =>
      prevTypes.filter((type) => type.id !== typeToDelete.id)
    );

    setShowDeleteTypeModal(false);
    toast.success(`Тип "${typeToDelete.name}" удален`);
  };

  const openTypeForm = () => setIsTypeFormOpen(true);
  const closeTypeForm = () => setIsTypeFormOpen(false);

  const handleTypeAdded = () => {
    toast("Список Типов обновлен", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
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
              Добавить тип
            </Button>
          </>
        )}
      </div>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-cell">Type Name</th>
            <th className="table-cell">Actions</th>
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
              </tr>
            ) : (
              <tr key={type.id} className="table-row">
                <td className="table-cell">{type.name}</td>
                <td className="table-cell">
                  <button
                    onClick={() => handleEdit(type)}
                    className="action-button edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteTypeModal(type)}
                    className="action-button delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Модальное окно удаления */}
      {showDeleteTypeModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить тип "{typeToDelete.name}"? Это
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
