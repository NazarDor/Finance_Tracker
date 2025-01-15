"use client";

import UserTable from "../components/Tables/UsersTable/UserTable";
import "./style.css";

export default function Users() {
  return (
    <section>
      <div className="user-page">
        <h1 className="title">User Management</h1>
        <UserTable />
      </div>
    </section>
  );
}
