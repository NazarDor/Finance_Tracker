"use client";

import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ChartComponent.css";
import { articles, types, categories } from "../../data";
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
    line: [["Місяць", "Надходження", "Витрати"]],
    bar: [["Місяць", "Надходження", "Витрати"]],
    pieIncome: [["Категорія", "Сумма"]],
    pieExpense: [["Категорія", "Сумма"]],
    area: [["Місяць", "Надходження", "Витрати"]],
    column: [["Місяць", "Надходження", "Витрати"]],
    bank: [["Місяць", "Надходження (БАНК)", "Витрати (БАНК)"]],
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
        // const [itemsResponse, typesResponse, categoriesResponse] =
        //   await Promise.all([
        //     fetch("http://localhost/api/articles"),
        //     fetch("http://localhost/api/types"),
        //     fetch("http://localhost/api/categories"),
        //   ]);

        // const articles = await itemsResponse.json();
        // const types = await typesResponse.json();
        // const categories = await categoriesResponse.json();

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

        const months = [...new Set(processedData.map((item) => item.month))];
        const categoriesList = [
          ...new Set(processedData.map((item) => item.category)),
        ];

        const updatedChartData = {
          line: [["Місяць", "Надходження", "Витрати"]],
          bar: [["Місяць", "Надходження", "Витрати"]],
          pieIncome: [["Категорія", "Сумма"]],
          pieExpense: [["Категорія", "Сумма"]],
          area: [["Місяць", "Надходження", "Витрати"]],
          column: [["Місяць", "Надходження", "Витрати"]],
        };

        months.forEach((month) => {
          const income = processedData
            .filter(
              (item) => item.month === month && item.type === "Надходження"
            )
            .reduce((sum, item) => sum + item.price, 0);

          const expenses = processedData
            .filter((item) => item.month === month && item.type === "Витрати")
            .reduce((sum, item) => sum + item.price, 0);

          updatedChartData.line.push([month, income, expenses]);
          updatedChartData.column.push([month, income, expenses]);
          updatedChartData.bar.push([month, income, expenses]);
          updatedChartData.area.push([month, income, expenses]);
        });

        categoriesList.forEach((category) => {
          const incomeAmount = processedData
            .filter(
              (item) =>
                item.category === category && item.type === "Надходження"
            )
            .reduce((sum, item) => sum + item.price, 0);

          const expenseAmount = processedData
            .filter(
              (item) => item.category === category && item.type === "Витрати"
            )
            .reduce((sum, item) => sum + item.price, 0);

          updatedChartData.pieIncome.push([category, incomeAmount]);
          updatedChartData.pieExpense.push([category, expenseAmount]);
        });

        setChartData(updatedChartData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [articles, types, categories]);

  const renderChart = () => {
    if (chartType === "pie") {
      return (
        <div className="pie-charts-container">
          <div className="pie-chart">
            <h2>Надходження</h2>
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
            <h2>Витрати</h2>
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
    } else {
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
              : chartType === "column"
              ? "ColumnChart"
              : "PieChart"
          }
          data={chartData[chartType]}
          options={chartOptions[chartType]}
          width={"100%"}
          height={"400px"}
        />
      );
    }
  };

  return (
    <section>
      <div className="chart-header">
        <div className="chart-title">Надходження та видатки (КАСА)</div>
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
