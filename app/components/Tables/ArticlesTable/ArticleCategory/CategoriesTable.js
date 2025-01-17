import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../ArticleTable.css";
import Button from "../../../Button/Button";
import AddCategoryForm from "../../../Forms/Categories/AddCategoryForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashCan,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import Switch from "react-switch";
import IconMapper from "../../../IconMapper/IconMapper";
import { useSession } from "next-auth/react";

export default function CategorieTable() {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  const [formData, setFormData] = useState({ name: "", typeId: "" });

  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const openCategoryForm = () => setIsCategoryFormOpen(true);
  const closeCategoryForm = () => setIsCategoryFormOpen(false);

  const [isMyCategoriesOnly, setIsMyCategoriesOnly] = useState(true);
  const [isOtherCategoriesOnly, setIsOtherCategoriesOnly] = useState(true);
  const { data: session } = useSession();
  const handleMyToggleChange = () => {
    setIsMyCategoriesOnly((prev) => !prev);
  };

  const handleOtherToggleChange = () => {
    setIsOtherCategoriesOnly((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      const [typesResponse, categoriesResponse] = await Promise.all([
        fetch("/api/types"),
        fetch("/api/categories"),
      ]);

      const typesData = await typesResponse.json();
      const categoriesData = await categoriesResponse.json();
      setTypes(typesData);
      setCategories(categoriesData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const typesMap = types.reduce((acc, type) => {
    acc[type.id] = type.name;
    return acc;
  }, {});

  const filteredCategories = categories.filter((category) => {
    if (isMyCategoriesOnly && isOtherCategoriesOnly) {
      return true;
    } else if (isMyCategoriesOnly) {
      return typesMap[category.typeId] === "Расход";
    } else if (isOtherCategoriesOnly) {
      return typesMap[category.typeId] === "Доход";
    }
    return false;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (category) => {
    setEditCategory(category.id);
    setFormData({ name: category.name, typeId: category.typeId });
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

  const handleCategoryAdded = () => {
    fetchData();
    toast("Список Категорий обновлен", {
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
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editCategory,
          typeId: Number(formData.typeId),
          name: formData.name,
        }),
      });

      if (response.ok) {
        fetchData();
        setEditCategory(null);
        toast.success("Категория успешно обновлена");
      } else {
        const error = await response.json();
        toast.error(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Не удалось обновить категорию");
    }
  };

  const handleCategoryDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: categoryToDelete.id }),
      });

      if (response.ok) {
        fetchData();
        toast("Категория удалена", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        toast("Список категорий обновлен", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setShowDeleteCategoryModal(false);
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
      {isCategoryFormOpen && (
        <AddCategoryForm
          onClose={closeCategoryForm}
          onCategoryAdded={handleCategoryAdded}
        />
      )}

      <div className="add-btn-conteiner-article">
        <div className="add-btn-conteiner-title">Доход</div>
        <Switch
          checked={isOtherCategoriesOnly}
          onChange={handleOtherToggleChange}
          onColor="#86d3ff"
          offColor="#ccc"
          checkedIcon={false}
          uncheckedIcon={false}
        />
        <div className="add-btn-conteiner-title">Расход</div>
        <Switch
          checked={isMyCategoriesOnly}
          onChange={handleMyToggleChange}
          onColor="#86d3ff"
          offColor="#ccc"
          checkedIcon={false}
          uncheckedIcon={false}
        />
        <Button isActive={false} buttonClicked={openCategoryForm}>
          <FontAwesomeIcon icon={faCirclePlus} />
        </Button>
      </div>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-cell">Тип</th>
            <th className="table-cell">Категория</th>
            <th className="table-cell">Иконка</th>
            {session?.user.status === "Admin" && (
              <th className="table-cell">Действия</th>
            )}
          </tr>
        </thead>
        <tbody className="table-body">
          {filteredCategories.map((category) =>
            editCategory === category.id ? (
              <tr key={category.id} className="table-row">
                <td className="table-cell">
                  <select
                    name="typeId"
                    value={formData.typeId || category.typeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Выберите тип
                    </option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </td>
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
                <td className="table-cell">{typesMap[category.typeId]}</td>
                <td className="table-cell">{category.name}</td>
                <td className="table-cell">
                  <div className="icon-mapper">
                    <div className="icon">
                      <IconMapper
                        iconClass={category.iconClass}
                        iconColor={category.iconColor}
                      />
                    </div>
                  </div>
                </td>
                {session?.user.status === "Admin" && (
                  <td className="table-cell">
                    <button
                      onClick={() => handleEdit(category)}
                      className="action-button edit"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => openDeleteCategoryModal(category)}
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

      {showDeleteCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить категорию "{categoryToDelete.id}"?
              Это действие необратимо.
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
