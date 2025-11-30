// frontend/src/components/Dashboard/StatsCard.jsx - COMPLETE VERSION
import React from "react";
import { Link } from "react-router-dom";
import "./StatsCard.css";

const StatsCard = ({ title, value, subtitle, color, link, icon }) => {
  const CardContent = () => (
    <>
      {icon && <div className="stats-icon">{icon}</div>}
      <div className="stats-content">
        <h3>{title}</h3>
        <div className="stats-value" style={{ color }}>
          {value}
        </div>
        <p className="stats-subtitle">{subtitle}</p>
      </div>
      {link && (
        <div className="stats-arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </>
  );

  // Jika ada link, bungkus dengan Link component
  if (link) {
    return (
      <Link
        to={link}
        className="stats-card stats-card-link"
        style={{ borderLeftColor: color }}
      >
        <CardContent />
      </Link>
    );
  }

  // Jika tidak ada link, render sebagai div biasa
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <CardContent />
    </div>
  );
};

export default StatsCard;
