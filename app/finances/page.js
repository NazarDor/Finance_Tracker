"use client";

import { useState, useEffect } from "react";
import "./Finances.css";
import { articles, types, categories } from "../data";
import ChartComponent from "../components/ChartComponent/ChartComponent";
import ChartBankComponent from "../components/ChartBankComponent/ChartBankComponent";
import ItemsTable from "../components/Tables/ItemsTable/ItemsTable";

export default function Finances() {
  const [itemsData, setItemsData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, typesResponse, categoriesResponse] =
          await Promise.all([
            fetch("http://localhost/api/articles"),
            fetch("http://localhost/api/types"),
            fetch("http://localhost/api/categories"),
          ]);

        const articles = await itemsResponse.json();
        const types = await typesResponse.json();
        const categories = await categoriesResponse.json();

        const processedData = articles.map((item) => {
          const type =
            types.find((t) => t.id === item.type_id)?.name || "Unknown";
          const category =
            categories.find((c) => c.id === item.category_id)?.name ||
            "Unknown";

          return {
            date: new Date(item.date),
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
        setFilteredData(processedData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const filtered = itemsData.filter((item) => {
        return (
          item.date >= new Date(dateRange.startDate) &&
          item.date <= new Date(dateRange.endDate)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(itemsData);
    }
  }, [dateRange, itemsData]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section>
      <div className="finances">
        <div className="income_container">
          <div className="income-body">
            <ChartComponent />
            <ChartBankComponent />
            <div className="items-table">
              <div className="date-filter">
                <label>
                  Начальная дата:
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                  />
                </label>
                <label>
                  Конечная дата:
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                  />
                </label>
                <button
                  className="reset-button"
                  onClick={() => setDateRange({ startDate: "", endDate: "" })}
                >
                  Сбросить даты
                </button>
              </div>
              <ItemsTable data={filteredData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
