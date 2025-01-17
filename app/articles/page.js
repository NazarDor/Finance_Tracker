"use client";

import "./Articles.css";
import TypesTable from "../components/Tables/ArticlesTable/ArticleTypes/TypesTable";
import CategorieTable from "../components/Tables/ArticlesTable/ArticleCategory/CategoriesTable";
import ArticlesTable from "../components/Tables/ArticlesTable/Articles/ArticlesTable";
import GlobalButtons from "../components/GlobalButtons/GlobalButtons";

export default function Articles() {
  return (
    <section>
      <div className="articles">
        <div className="income_container">
          <div className="income-body">
            <GlobalButtons />
            <div className="articles-page">
              <div className="articles-row">
                <div className="articles-column">
                  <h1 className="title">Типы</h1>
                  <TypesTable />
                </div>
                <div className="articles-column">
                  <h1 className="title">Категории</h1>
                  <CategorieTable />
                </div>
              </div>
              <div className="articles-row">
                <div className="articles-column">
                  <h1 className="title">Статьи</h1>
                  <ArticlesTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
