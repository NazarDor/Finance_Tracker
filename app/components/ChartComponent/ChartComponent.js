"use client";

import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ChartComponent.css";
import {
  faChartLine,
  faChartBar,
  faChartPie,
  faChartArea,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";

export default function ChartComponent() {
  const [chartType, setChartType] = useState("column");
  const [chartData, setChartData] = useState({
    line: [["Месяц", "Доход", "Расход"]],
    bar: [["Месяц", "Доход", "Расход"]],
    pieIncome: [["Категорія", "Сумма"]],
    pieExpense: [["Категорія", "Сумма"]],
    area: [["Месяц", "Доход", "Расход"]],
    column: [["Месяц", "Доход", "Расход"]],
    bank: [["Месяц", "Доход", "Расход"]],
  });
  const chartOptions = {
    line: {
      legend: { position: "top" },
    },
    bar: {
      bars: "vertical",
      bar: { groupWidth: "75%" },
      legend: { position: "top" },
    },
    column: {
      legend: { position: "top" },
    },
    pie: {
      pieHole: 0.4,
      is3D: true,
    },
    area: {
      legend: { position: "top" },
      hAxis: { title: "Рік", titleTextStyle: { color: "#333" } },
      vAxis: { minValue: 0 },
      chartArea: { width: "100%", height: "70%" },
    },
  };

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
            amount: parseFloat(item.amount),
            description: item.description || "",
          };
        });

        const categoriesList = [
          ...new Set(processedData.map((item) => item.category)),
        ];

        const updatedChartData = {
          line: [["Дата", "Доход", "Расход"]],
          bar: [["Дата", "Доход", "Расход"]],
          pieIncome: [["Категорія", "Сумма"]],
          pieExpense: [["Категорія", "Сумма"]],
          area: [["Дата", "Доход", "Расход"]],
          column: [["Дата", "Доход", "Расход"]],
        };

        processedData.forEach((item) => {
          const dateLabel = new Date(item.date).toLocaleDateString("uk-UA");
          const amount = Number(item.amount) || 0;
          if (item.type == "Доход") {
            updatedChartData.line.push([dateLabel, amount, 0]);
            updatedChartData.column.push([dateLabel, amount, 0]);
            updatedChartData.bar.push([dateLabel, amount, 0]);
            updatedChartData.area.push([dateLabel, amount, 0]);
          } else if (item.type == "Расход") {
            updatedChartData.line.push([dateLabel, 0, amount]);
            updatedChartData.column.push([dateLabel, 0, amount]);
            updatedChartData.bar.push([dateLabel, 0, amount]);
            updatedChartData.area.push([dateLabel, 0, amount]);
          }
        });

        categoriesList.forEach((category) => {
          const incomeAmount = processedData
            .filter(
              (item) =>
                item.category == category && item.type == "Доход"
            )
            .reduce((sum, item) => sum + item.amount, 0);

          const expenseAmount = processedData
            .filter(
              (item) =>
                item.category == category && item.type == "Расход"
            )
            .reduce((sum, item) => sum + item.amount, 0);

          updatedChartData.pieIncome.push([category, incomeAmount]);
          updatedChartData.pieExpense.push([category, expenseAmount]);
        });

        setChartData(updatedChartData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  const renderChart = () => {
    if (chartType === "pie") {
      return (
        <div className="pie-charts-container">
          <div className="pie-chart">
            <h2>Доход</h2>
            <Chart
              className="chart-component"
              chartType="PieChart"
              data={chartData.pieIncome}
              options={chartOptions.pie}
              width={"100%"}
              height={"400px"}
            />
          </div>
          <div className="pie-chart">
            <h2>Расход</h2>
            <Chart
              className="chart-component"
              chartType="PieChart"
              data={chartData.pieExpense}
              options={chartOptions.pie}
              width={"100%"}
              height={"400px"}
            />
          </div>
        </div>
      );
    }

    return (
      <Chart
        className="chart-component"
        chartType={
          chartType === "line"
            ? "LineChart"
            : chartType === "bar"
            ? "BarChart"
            : chartType === "area"
            ? "AreaChart"
            : "ColumnChart"
        }
        data={chartData[chartType]}
        options={chartOptions[chartType]}
        width={"100%"}
        height={"400px"}
      />
    );
  };

  return (
    <section>
      <div className="chart-header">
        <div className="chart-title">Доход и расход</div>
        <div className="chart-buttons">
          <Button
            isActive={chartType === "line"}
            buttonClicked={() => setChartType("line")}
          >
            <FontAwesomeIcon icon={faChartLine} />
          </Button>

          <Button
            isActive={chartType === "bar"}
            buttonClicked={() => setChartType("bar")}
          >
            <FontAwesomeIcon icon={faChartBar} />
          </Button>

          <Button
            isActive={chartType === "column"}
            buttonClicked={() => setChartType("column")}
          >
            <FontAwesomeIcon icon={faChartColumn} />
          </Button>

          <Button
            isActive={chartType === "pie"}
            buttonClicked={() => setChartType("pie")}
          >
            <FontAwesomeIcon icon={faChartPie} />
          </Button>
          <Button
            isActive={chartType === "area"}
            buttonClicked={() => setChartType("area")}
          >
            <FontAwesomeIcon icon={faChartArea} />
          </Button>
        </div>
      </div>

      <div>{renderChart()}</div>
    </section>
  );
}
