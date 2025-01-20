"use client";

import { useEffect, useState } from "react";
import "./SummModule.css";
import Switch from "react-switch";
import { useSession } from "next-auth/react";

const SummModule = () => {
  const [itemsData, setItemsData] = useState([]); // Изначально пустой массив
  const [isMyItemsOnly, setIsMyItemsOnly] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, typesResponse, categoriesResponse] =
          await Promise.all([
            fetch("api/articles"),
            fetch("api/types"),
            fetch("api/categories"),
          ]);

        const articles = await itemsResponse.json();
        const types = await typesResponse.json();
        const categories = await categoriesResponse.json();

        const typeMap = types.reduce((acc, type) => {
          acc[type.id] = type.name;
          return acc;
        }, {});

        const categoryMap = categories.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});

        const sortedData = articles.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const processedData = sortedData.map((item) => {
          const type = typeMap[item.typeId] || "Unknown";
          const category = categoryMap[item.categoryId] || "Unknown";

          return {
            date: new Date(item.date),
            type,
            category,
            userId: item.userId,
            amount: parseFloat(item.amount),
            description: item.description || "",
          };
        });
        setItemsData(processedData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [isMyItemsOnly]);

  const filteredItems = isMyItemsOnly
    ? itemsData.filter((item) => item.userId === session?.user.id)
    : itemsData;

  const handleMyToggleChange = () => {
    setIsMyItemsOnly((prev) => !prev);
  };

  const totalIncome = filteredItems
    .filter((item) => item.type === "Доход")
    .reduce((acc, item) => acc + item.amount, 0); // Используем amount вместо price

  const totalExpense = filteredItems
    .filter((item) => item.type === "Расход")
    .reduce((acc, item) => acc + item.amount, 0); // Используем amount вместо price

  const balance = totalIncome - totalExpense;

  return (
    <div className="summ-module">
      <div
        className="summ-module-item"
        style={{ color: balance < 0 ? "red" : "inherit" }}
      >
        <p>Баланс:</p>
        <p>{balance.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}</p>
      </div>
      <div className="summ-module-item">
        <p>Доходы:</p>
        <p>
          {totalIncome.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="summ-module-item">
        <p>Расходы:</p>
        <p>
          {totalExpense.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}
        </p>
      </div>
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
    </div>
  );
};

export default SummModule;
