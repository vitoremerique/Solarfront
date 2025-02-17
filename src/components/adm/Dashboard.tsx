import { useState } from "react";
import { FaUsers, FaTasks } from "react-icons/fa";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("usuarios");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <span className="logo-primary">InterLig</span>
          <span className="logo-secondary">Solar</span>
        </div>
        <div
          className={`sidebar-item ${activeTab === "usuarios" ? "active" : ""}`}
          onClick={() => setActiveTab("usuarios")}
        >
          <FaUsers /> Usuários
        </div>
        <div
          className={`sidebar-item ${activeTab === "processos" ? "active" : ""}`}
          onClick={() => setActiveTab("processos")}
        >
          <FaTasks /> Processos
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "usuarios" ? <UserManagement /> : <ProcessManagement />}
      </div>
    </div>
  );
}

function UserManagement() {
  return (
    <div className="content-box">
      <h2>Gerenciamento de Usuários</h2>
      <p>Lista e ações para usuários vão aqui.</p>
    </div>
  );
}

function ProcessManagement() {
  return (
    <div className="content-box">
      <h2>Gerenciamento de Processos</h2>
      <p>Lista e ações para processos vão aqui.</p>
    </div>
  );
}
