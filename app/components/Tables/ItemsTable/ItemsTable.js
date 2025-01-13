import { useState } from "react";
import "./ItemsTable.css";
import TooltipIcon from "../../TooltipIcon/TooltipIcon";

export default function ItemsTable({ data }) {
  const [filters, setFilters] = useState({
    type: "Надходження",
    month: "Усі",
    category: "Усі",
  });

  const getMonthFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("uk-UA", { month: "long" });
  };

  // Add month field dynamically from date
  const processedData = data.map((item) => ({
    ...item,
    month: getMonthFromDate(item.date),
    fullDate: `${item.date} (${getMonthFromDate(item.date)})`,
  }));

  const uniqueValues = {
    type: [...new Set(processedData.map((item) => item.type))],
    month: [...new Set(processedData.map((item) => item.month))],
    category:
      filters.type === "Усі"
        ? [...new Set(processedData.map((item) => item.category))]
        : [
            ...new Set(
              processedData
                .filter((item) => item.type === filters.type)
                .map((item) => item.category)
            ),
          ],
  };

  const filteredData = processedData.filter((item) => {
    return (
      (filters.type === "Усі" || item.type === filters.type) &&
      (filters.month === "Усі" || item.month === filters.month) &&
      (filters.category === "Усі" || item.category === filters.category)
    );
  });

  const totalSum = filteredData.reduce((acc, item) => acc + item.price, 0);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
      ...(field === "type" ? { category: "Усі" } : {}),
    }));
  };

  const formatFullDate = (fullDate) => {
    const date = new Date(fullDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("uk-UA", { month: "long" });
    const year = date.getFullYear();

    return `${day}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${year} (${month[0].toUpperCase() + month.slice(1)})`;
  };

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
                  {uniqueValues.type.map((type) => (
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
                  {uniqueValues.month.map((month) => (
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
                  {uniqueValues.category.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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
                <td className="table-cell">{formatFullDate(item.fullDate)}</td>
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
