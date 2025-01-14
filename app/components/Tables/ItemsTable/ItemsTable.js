import { useState, useEffect } from "react";
import "./ItemsTable.css";
import TooltipIcon from "../../TooltipIcon/TooltipIcon";

export default function ItemsTable() {
  const [itemsData, setItemsData] = useState([]);
  const [filters, setFilters] = useState({
    type: "Усі",
    month: "Усі",
    category: "Усі",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, typesData, categoriesData] = await Promise.all([
          fetch("/api/articles").then((res) => res.json()),
          fetch("/api/types").then((res) => res.json()),
          fetch("/api/categories").then((res) => res.json()),
        ]);

        const processedData = articlesData.map((item) => {
          const type = typesData.find((t) => t.id === item.typeId)?.name || "Unknown";
          const category =
            categoriesData.find((c) => c.id === item.categoryId)?.name || "Unknown";

          return {
            date: new Date(item.date).toISOString(),
            month: new Date(item.date).toLocaleString("uk-UA", {
              month: "long",
            }),
            type,
            category,
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

  const totalSum = itemsData.reduce((acc, item) => acc + item.price, 0);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
      ...(field === "type" ? { category: "Усі" } : {}),
    }));
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredData = itemsData.filter((item) => {
    return (
      (filters.type === "Усі" || item.type === filters.type) &&
      (filters.month === "Усі" || item.month === filters.month) &&
      (filters.category === "Усі" || item.category === filters.category)
    );
  });

  return (
    <div>
      <h2>Загальний список статей надходжень та витрат</h2>
      <div className="table max-h-[400px] overflow-y-scroll">
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-header">
                Тип статті
                <br />
                <select
                  id="type-filter"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="Усі">Усі</option>
                  {[...new Set(itemsData.map((item) => item.type))].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </th>
              <th className="table-header">
                Місяць
                <br />
                <select
                  id="month-filter"
                  value={filters.month}
                  onChange={(e) => handleFilterChange("month", e.target.value)}
                >
                  <option value="Усі">Усі</option>
                  {[...new Set(itemsData.map((item) => item.month))].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </th>
              <th className="table-header">
                Категорія
                <br />
                <select
                  id="category-filter"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <option value="Усі">Усі</option>
                  {[...new Set(itemsData.map((item) => item.category))].map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
              </th>
              <th className="table-header">
                Загальна сумма
                <span>
                  (
                  {totalSum.toLocaleString("uk-UA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  )
                </span>
              </th>
              <th className="table-header descrition"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="table-cell">{item.type}</td>
                <td className="table-cell">{formatFullDate(item.date)}</td>
                <td className="table-cell">{item.category}</td>
                <td className="table-cell">
                  {item.price.toLocaleString("uk-UA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="table-cell descrition">
                  <TooltipIcon description={item.description} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
