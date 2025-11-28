import React from "react";
import "./StatsCard.css";

const StatsCard = ({ title, value, subtitle, color }) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <h3>{title}</h3>
      <div className="stats-value" style={{ color }}>
        {value}
      </div>
      <p className="stats-subtitle">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
