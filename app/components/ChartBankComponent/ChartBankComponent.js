"use client";

import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../ChartComponent/ChartComponent.css";
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
  const [chartBankData, setChartBankData] = useState({
    bank: [["Месяц", "Доход", "Расход"]],
  });

  const chartOptions = {
    line: {
      legend: { position: "top" },
      colors: ["#008000", "#FFA500"],
      hAxis: { title: "Месяц", titleTextStyle: { color: "#333" } },
      vAxis: { title: "Сумма", titleTextStyle: { color: "#333" }, minValue: 0 },
    },
    bar: {
      bars: "vertical",
      colors: ["#008000", "#FFA500"],
      bar: { groupWidth: "75%" },
      legend: { position: "top" },
    },
    column: {
      legend: { position: "top" },
      colors: ["#008000", "#FFA500"],
      hAxis: { title: "Месяц", titleTextStyle: { color: "#333" } },
      vAxis: { title: "Сумма", titleTextStyle: { color: "#333" }, minValue: 0 },
    },
    pie: {
      pieHole: 0.4,
      is3D: true,
      pieSliceText: "percentage",
      tooltip: { showColorCode: true },
      legend: { position: "labeled" },
      slices: {
        0: { offset: 0.1 },
      },
    },
    area: {
      legend: { position: "top" },
      vAxis: { minValue: 0 },
      chartArea: { width: "100%", height: "70%" },
      colors: ["#008000", "#FFA500"],
    },
    bank: {
      legend: { position: "top" },
      colors: ["#008000", "#FFA500"],
      hAxis: { title: "Месяц", titleTextStyle: { color: "#333" } },
      vAxis: { title: "Сумма", titleTextStyle: { color: "#333" }, minValue: 0 },
    },
  };

  useEffect(() => {
    const processedData = articles.map((item) => {
      const type = types.find((t) => t.id === item.type_id)?.name || "Unknown";
      const category =
        categories.find((c) => c.id === item.category_id)?.name || "Unknown";

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

    const updatedChartBankData = {
      pieBankIncome: [["Категорія", "Сумма"]],
      pieBankExpense: [["Категорія", "Сумма"]],
      bank: [["Месяц", "Доход", "Расход"]],
    };

    months.forEach((month) => {
      const bankIncome = processedData
        .filter(
          (item) => item.month === month && item.type === "Доход"
        )
        .reduce((sum, item) => sum + item.price, 0);

      const bankExpense = processedData
        .filter(
          (item) => item.month === month && item.type === "Расход"
        )
        .reduce((sum, item) => sum + item.price, 0);

      updatedChartBankData.bank.push([month, bankIncome, bankExpense]);
    });

    categoriesList.forEach((category) => {
      const incomeBankAmount = processedData
        .filter(
          (item) =>
            item.category === category && item.type === "Доход"
        )
        .reduce((sum, item) => sum + item.price, 0);

      const expenseBankAmount = processedData
        .filter(
          (item) => item.category === category && item.type === "Расход"
        )
        .reduce((sum, item) => sum + item.price, 0);

      updatedChartBankData.pieBankIncome.push([category, incomeBankAmount]);
      updatedChartBankData.pieBankExpense.push([category, expenseBankAmount]);
    });

    setChartBankData(updatedChartBankData);
  }, [articles, types, categories]);

  const renderChart = () => {
    if (chartType === "pie") {
      return (
        <div className="pie-charts-container">
          <div className="pie-chart">
            <h2>Доход</h2>
            <Chart
              className="chart-component"
              chartType="PieChart"
              data={chartBankData.pieBankIncome}
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
              data={chartBankData.pieBankExpense}
              options={chartOptions.pie}
              width={"100%"}
              height={"400px"}
            />
          </div>
        </div>
      );
    } else if (chartType == "bank") {
      return (
        <Chart
          className="chart-component"
          chartType="ColumnChart"
          data={chartBankData.bank}
          options={chartOptions.column}
          width={"100%"}
          height={"400px"}
        />
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
          data={chartBankData.bank}
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
        <div className="chart-title">Прихд и расход</div>

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
