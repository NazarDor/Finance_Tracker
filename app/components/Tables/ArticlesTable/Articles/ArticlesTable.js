import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../ArticleTable.css";
import { useSession } from "next-auth/react";
import Button from "../../../Button/Button";
import AddArticleForm from "../../../Forms/Articles/AddArticleForm";

export default function ArticlesTable() {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [editArticle, setEditArticle] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    typeId: "",
    categoryId: "",
    amount: "",
    date: "",
    description: "",
  });
  const [showDeleteArticleModal, setShowDeleteArticleModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const { data: session } = useSession();

  const fetchData = async () => {
    try {
      const [typesResponse, categoriesResponse, articlesResponse] =
        await Promise.all([
          fetch("/api/types"),
          fetch("/api/categories"),
          fetch("/api/articles"),
        ]);

      const typesData = await typesResponse.json();
      const categoriesData = await categoriesResponse.json();
      const articlesData = await articlesResponse.json();

      setTypes(typesData);
      setCategories(categoriesData);
      setArticles(articlesData);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const typesMap = types.reduce((acc, type) => {
    acc[type.id] = type.name;
    return acc;
  }, {});

  const categoriesMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("ru-RU", options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (article) => {
    setEditArticle(article.id);
    setFormData({
      name: article.name,
      typeId: article.typeId,
      categoryId: article.categoryId,
      amount: article.amount,
      date: article.date,
      description: article.description,
    });
  };

  const handleCancel = () => {
    setEditArticle(null);
  };

  const openDeleteArticleModal = (article) => {
    setArticleToDelete(article);
    setShowDeleteArticleModal(true);
  };

  const closeDeleteArticleModal = () => {
    setShowDeleteArticleModal(false);
  };

  const openArticleForm = () => setIsArticleFormOpen(true);
  const closeArticleForm = () => setIsArticleFormOpen(false);

  const handleArticleAdded = () => {
    fetchData();
    toast("Список статей обновлен", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleSave = async () => {
    if (formData.description.trim() === "") {
      toast.error("Все поля должны быть заполнены.");
      return;
    }

    try {
      const response = await fetch("/api/articles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editArticle,
          ...formData,
        }),
      });

      if (response.ok) {
        const editArticle = await response.json();
        fetchData();
        setEditArticle(null);
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

  const handleArticleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: articleToDelete.id }),
      });

      if (response.ok) {
        fetchData();
        toast("Статья удалена", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        toast("Список статей обновлен", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setShowDeleteArticleModal(false);
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
      {isArticleFormOpen && (
        <AddArticleForm
          onClose={closeArticleForm}
          onArticleAdded={handleArticleAdded}
        />
      )}

      <div className="add-btn-conteiner">
        {session?.user.status === "Admin" && (
          <Button isActive={false} buttonClicked={openArticleForm}>
            Добавить статью
          </Button>
        )}
      </div>

      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-cell">Тип</th>
            <th className="table-cell">Категория</th>
            <th className="table-cell">Сумма</th>
            <th className="table-cell">Дата</th>
            <th className="table-cell">Описание</th>
            <th className="table-cell">Действия</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {articles.map((article) =>
            editArticle === article.id ? (
              <tr key={article.id} className="table-row">
                <td className="table-cell">
                  <select
                    name="typeId"
                    value={formData.typeId}
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
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Выберите категорию
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="table-cell">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </td>
                <td className="table-cell">
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    required
                  />
                </td>
                <td className="table-cell">
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Введите описание"
                  />
                </td>
                <td className="table-cell">
                  <button onClick={handleSave} className="action-button save">
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancel}
                    className="action-button cancel"
                  >
                    Отменить
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={article.id} className="table-row">
                <td className="table-cell">{typesMap[article.typeId]}</td>
                <td className="table-cell">
                  {categoriesMap[article.categoryId]}
                </td>
                <td className="table-cell">{article.amount}</td>
                <td className="table-cell">{formatDate(article.date)}</td>
                <td className="table-cell">{article.description}</td>
                <td className="table-cell">
                  <button
                    onClick={() => handleEdit(article)}
                    className="action-button edit"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => openDeleteArticleModal(article)}
                    className="action-button delete"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {showDeleteArticleModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить статью "{articleToDelete.id}"? Это
              действие необратимо.
            </p>
            <div className="modal-actions">
              <button
                onClick={handleArticleDelete}
                className="modal-button confirm"
              >
                Да, удалить
              </button>
              <button
                onClick={closeDeleteArticleModal}
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
