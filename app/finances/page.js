"use client";

import "./Finances.css";
import ChartComponent from "../components/ChartComponent/ChartComponent";
import ChartBankComponent from "../components/ChartBankComponent/ChartBankComponent";
import ItemsTable from "../components/Tables/ItemsTable/ItemsTable";
import GlobalButtons from "../components/GlobalButtons/GlobalButtons";

export default function Finances() {
  return (
    <section>
      <div className="finances">
        <div className="income_container">
          <div className="income-body">
            <GlobalButtons />
            <ChartComponent />
            {/* <ChartBankComponent /> */}
            <div className="items-table">
              <ItemsTable />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
