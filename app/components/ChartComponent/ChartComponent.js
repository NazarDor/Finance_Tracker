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
  faCalendarDay,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Switch from "react-switch";

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
  const [viewMode, setViewMode] = useState("daily");
  const [isMyDataOnly, setIsMyDataOnly] = useState(false);
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

        const groupData = (data, mode) => {
          if (mode === "daily") {
            return data.map((item) => ({
              label: item.date.toLocaleDateString("uk-UA"),
              income: item.type === "Доход" ? item.amount : 0,
              expense: item.type === "Расход" ? item.amount : 0,
            }));
          }

          if (mode === "monthly") {
            const grouped = {};
            data.forEach((item) => {
              const monthLabel = item.date.toLocaleDateString("uk-UA", {
                year: "numeric",
                month: "long",
              });
              if (!grouped[monthLabel]) {
                grouped[monthLabel] = { income: 0, expense: 0 };
              }

              if (item.type === "Доход") {
                grouped[monthLabel].income += item.amount;
              } else if (item.type === "Расход") {
                grouped[monthLabel].expense += item.amount;
              }
            });

            return Object.entries(grouped).map(
              ([label, { income, expense }]) => ({
                label,
                income,
                expense,
              })
            );
          }
        };

        const updateChartData = (mode) => {
          const filteredDate = isMyDataOnly
            ? processedData
            : processedData.filter((item) => item.userId === session?.user.id);

          const groupedData = groupData(filteredDate, mode);
          const updatedChartData = {
            line: [["Дата", "Доход", "Расход"]],
            bar: [["Дата", "Доход", "Расход"]],
            area: [["Дата", "Доход", "Расход"]],
            column: [["Дата", "Доход", "Расход"]],
            pieIncome: [["Категорія", "Сумма"]],
            pieExpense: [["Категорія", "Сумма"]],
          };

          groupedData.forEach((item) => {
            updatedChartData.line.push([
              item.label,
              item.income || 0,
              item.expense || 0,
            ]);
            updatedChartData.bar.push([
              item.label,
              item.income || 0,
              item.expense || 0,
            ]);
            updatedChartData.area.push([
              item.label,
              item.income || 0,
              item.expense || 0,
            ]);
            updatedChartData.column.push([
              item.label,
              item.income || 0,
              item.expense || 0,
            ]);
          });

          const pieIncomeData = {};
          const pieExpenseData = {};

          filteredDate.forEach((item) => {
            if (item.type === "Доход") {
              pieIncomeData[item.category] =
                (pieIncomeData[item.category] || 0) + item.amount;
            } else if (item.type === "Расход") {
              pieExpenseData[item.category] =
                (pieExpenseData[item.category] || 0) + item.amount;
            }
          });

          for (const [category, sum] of Object.entries(pieIncomeData)) {
            updatedChartData.pieIncome.push([category, sum]);
          }
          for (const [category, sum] of Object.entries(pieExpenseData)) {
            updatedChartData.pieExpense.push([category, sum]);
          }

          return updatedChartData;
        };

        setChartData(updateChartData(viewMode));
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [viewMode, isMyDataOnly]);

  const handleToggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "daily" ? "monthly" : "daily"));
  };

  const handleMyToggleChange = () => {
    setIsMyDataOnly((prev) => !prev);
  };

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
              height={"300px"}
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
              height={"300px"}
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
          <div className="add-btn-conteiner-title">
            Мои
            <Switch
              checked={isMyDataOnly}
              onChange={handleMyToggleChange}
              onColor="#86d3ff"
              offColor="#ccc"
              checkedIcon={false}
              uncheckedIcon={false}
            />
            Все
          </div>
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
          <Button buttonClicked={handleToggleViewMode}>
            {viewMode === "daily" ? (
              <FontAwesomeIcon icon={faCalendarDays} />
            ) : (
              <FontAwesomeIcon icon={faCalendarDay} />
            )}
          </Button>
        </div>
      </div>

      <div>{renderChart()}</div>
    </section>
  );
}
