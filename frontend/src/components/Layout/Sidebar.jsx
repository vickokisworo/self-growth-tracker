// frontend/src/components/Layout/Sidebar.jsx - Modern Version
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/todos", label: "To-Do List" },
    { path: "/progress", label: "Progress" },
    { path: "/habits", label: "Habits" },
    { path: "/goals", label: "Goals" },
    { path: "/journal", label: "Journal" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
