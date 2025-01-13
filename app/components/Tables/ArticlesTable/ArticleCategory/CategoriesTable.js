import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../ArticleTable.css";
import { useSession } from "next-auth/react";
import Button from "../../../Button/Button";
import AddCategoryForm from "../../../Forms/Categories/AddCategoryForm";

export default function CategorieTable() {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  const [formData, setFormData] = useState({ name: "" });

  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const openCategoryForm = () => setIsCategoryFormOpen(true);
  const closeCategoryForm = () => setIsCategoryFormOpen(false);

  const { data: session } = useSession();

  const fetchData = async () => {
    try {
      const [categoriesResponse] = await Promise.all([
        fetch("/api/categories"),
      ]);

      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
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

  const handleEdit = (category) => {
    setEditCategory(category.id);
    setFormData({ name: category.name });
  };

  const handleSave = () => {
    if (formData.name.trim() === "") {
      toast.error("Название не может быть пустым.");
      return;
    }

    setCategory((prevCategory) =>
      prevCategory.map((category) =>
        category.id === editCategory
          ? { ...category, name: formData.name }
          : category
      )
    );
    setEditCategory(null);
    toast.success("Тип успешно обновлен");
  };

  const handleCancel = () => {
    setEditCategory(null);
  };

  const openDeleteCategoryModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteCategoryModal(true);
  };

  const closeDeleteCategoryModal = () => {
    setShowDeleteCategoryModal(false);
  };

  const handleCategoryDelete = () => {
    setCategory((prevCategory) =>
      prevCategory.filter((category) => category.id !== categoryToDelete.id)
    );
    
    setShowDeleteCategoryModal(false);
    toast.success(`Тип "${categoryToDelete.name}" удален`);
  };

  const handleCategoryAdded = () => {
    toast("Список Категорий обновлен", {
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
      {isCategoryFormOpen && (
        <AddCategoryForm
          onClose={closeCategoryForm}
          onCategoryAdded={handleCategoryAdded}
        />
      )}

      <div className="add-btn-conteiner">
        {session?.user.status === "Admin" && (
          <>
            <Button isActive={false} buttonClicked={openCategoryForm}>
              Добавить категорию
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
          {categories.map((category) =>
            editCategory === category.id ? (
              <tr key={category.id} className="table-row">
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
              <tr key={category.id} className="table-row">
                <td className="table-cell">{category.name}</td>
                <td className="table-cell">
                  <button
                    onClick={() => handleEdit(category)}
                    className="action-button edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteCategoryModal(category)}
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

      {showDeleteCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить тип "{categoryToDelete.name}"? Это
              действие необратимо.
            </p>
            <div className="modal-actions">
              <button
                onClick={handleCategoryDelete}
                className="modal-button confirm"
              >
                Да, удалить
              </button>
              <button
                onClick={closeDeleteCategoryModal}
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
