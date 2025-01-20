"use client";

import "./Articles.css";
import TypesTable from "../components/Tables/ArticlesTable/ArticleTypes/TypesTable";
import CategorieTable from "../components/Tables/ArticlesTable/ArticleCategory/CategoriesTable";
import ArticlesTable from "../components/Tables/ArticlesTable/Articles/ArticlesTable";
import GlobalButtons from "../components/GlobalButtons/GlobalButtons";
import {
  Accordion,
  AccordionItem,
} from "../components/AccordionItem/AccordionItem";
import { useTranslation } from "next-i18next";

export default function Articles() {
  const { t } = useTranslation("common");
  return (
    <section>
      {/* <div>{t("hello")}</div> */}
      <div className="articles">
        <div className="income_container">
          <div className="income-body">
            <GlobalButtons />
            <div className="articles-page">
              <div className="articles-row">
                <Accordion>
                  <AccordionItem title="Типы">
                    <TypesTable />
                  </AccordionItem>
                </Accordion>
                <Accordion>
                  <AccordionItem title="Категории">
                    <CategorieTable />
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="articles-row">
                <Accordion>
                  <AccordionItem title="Статьи (расходов или доходов)">
                    <ArticlesTable />
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
