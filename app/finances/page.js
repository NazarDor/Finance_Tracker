"use client";

import "./Finances.css";
import ChartComponent from "../components/ChartComponent/ChartComponent";
import ChartBankComponent from "../components/ChartBankComponent/ChartBankComponent";
import ItemsTable from "../components/Tables/ItemsTable/ItemsTable";
import GlobalButtons from "../components/GlobalButtons/GlobalButtons";
import {
  Accordion,
  AccordionItem,
} from "../components/AccordionItem/AccordionItem";
import SummModule from "../components/SummModule/SummModule";

export default function Finances() {
  return (
    <section>
      <div className="finances">
        <GlobalButtons />
        <Accordion>
          <AccordionItem title="Общий баланс">
            <SummModule />
          </AccordionItem>
          <AccordionItem title="Доход и расход">
            <div className="income-container">
              <div className="income-body">
                <ChartComponent />
                {/* <ChartBankComponent /> */}
              </div>
            </div>
          </AccordionItem>
          <AccordionItem title="Статьи">
            <div className="items-table">
              <ItemsTable />
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
