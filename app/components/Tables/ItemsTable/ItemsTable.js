import { useState, useEffect } from "react";
import "./ItemsTables.css";
import TooltipIcon from "../../TooltipIcon/TooltipIcon";
import Switch from "react-switch";
import { useSession } from "next-auth/react";

export default function ItemsTable() {
  const [itemsData, setItemsData] = useState([]);
  const [filters, setFilters] = useState({
    type: "Все",
    month: "Все",
    category: "Все",
  });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isMyItemsOnly, setIsMyItemsOnly] = useState(false);
  const { data: session } = useSession();

  const handleMyToggleChange = () => {
    setIsMyItemsOnly((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, typesData, categoriesData] = await Promise.all([
          fetch("/api/articles").then((res) => res.json()),
          fetch("/api/types").then((res) => res.json()),
          fetch("/api/categories").then((res) => res.json()),
        ]);

        const processedData = articlesData.map((item) => {
          const type =
            typesData.find((t) => t.id === item.typeId)?.name || "Unknown";
          const category =
            categoriesData.find((c) => c.id === item.categoryId)?.name ||
            "Unknown";

          return {
            date: new Date(item.date).toISOString(),
            month: new Date(item.date).toLocaleString("ru-RU", {
              month: "long",
            }),
            type,
            category,
            userId: item.userId,
            price: parseFloat(item.amount),
            description: item.description || "",
          };
        });

        setItemsData(processedData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filters.type === "Все") {
      setAvailableCategories([
        ...new Set(itemsData.map((item) => item.category)),
      ]);
    } else {
      const filteredCategories = itemsData
        .filter((item) => item.type === filters.type)
        .map((item) => item.category);
      setAvailableCategories([...new Set(filteredCategories)]);
    }
  }, [filters.type, itemsData]);

  const filteredData = itemsData.filter((item) => {
    return (
      (filters.type === "Все" || item.type === filters.type) &&
      (filters.month === "Все" || item.month === filters.month) &&
      (filters.category === "Все" || item.category === filters.category)
    );
  });

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
      ...(field === "type" ? { category: "Все" } : {}),
    }));
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredItems = isMyItemsOnly
    ? filteredData
    : filteredData.filter((item) => item.userId === session?.user.id);

  const totalSum = filteredItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div>
      <div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-header">
                Тип статьи
                <br />
                <select
                  id="type-filter"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="Все">Все</option>
                  {[...new Set(itemsData.map((item) => item.type))].map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </th>
              <th className="table-header">
                Месяц
                <br />
                <select
                  id="month-filter"
                  value={filters.month}
                  onChange={(e) => handleFilterChange("month", e.target.value)}
                >
                  <option value="Все">Все</option>
                  {[...new Set(itemsData.map((item) => item.month))].map(
                    (month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    )
                  )}
                </select>
              </th>
              <th className="table-header">
                Категория
                <br />
                <select
                  id="category-filter"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  disabled={filters.type === "Все"} // Блокировка, если тип не выбран
                >
                  <option value="Все">Все</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </th>
              <th className="table-header amount">
                <div className="add-btn-conteiner-title">
                  Мои
                  <Switch
                    checked={isMyItemsOnly}
                    onChange={handleMyToggleChange}
                    onColor="#86d3ff"
                    offColor="#ccc"
                    checkedIcon={false}
                    uncheckedIcon={false}
                  />
                  Все
                </div>

                <span>
                  (
                  {totalSum.toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  )
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={index}>
                <td className="table-cell">{item.type}</td>
                <td className="table-cell">{formatFullDate(item.date)}</td>
                <td className="table-cell">{item.category}</td>
                <td className="table-cell">
                  {item.price.toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <TooltipIcon
                    className="tooltip"
                    description={item.description}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
