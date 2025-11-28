import React from "react";
import { formatDisplayDate } from "../../utils/helpers";
import "./ProgressList.css";

const ProgressList = ({ progress, onEdit, onDelete }) => {
  if (progress.length === 0) {
    return (
      <div className="empty-state">
        <p>No progress entries yet. Start tracking your growth!</p>
      </div>
    );
  }

  return (
    <div className="progress-list">
      {progress.map((item) => (
        <div key={item.id} className="progress-card">
          <div className="progress-header">
            <div>
              <h3>{item.category}</h3>
              <p className="progress-date">{formatDisplayDate(item.date)}</p>
            </div>
            <div className="progress-rating">
              <span className="rating-value">{item.rating}</span>
              <span className="rating-max">/10</span>
            </div>
          </div>
          {item.notes && <p className="progress-notes">{item.notes}</p>}
          <div className="progress-actions">
            <button onClick={() => onEdit(item)} className="btn-secondary">
              Edit
            </button>
            <button onClick={() => onDelete(item.id)} className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressList;
