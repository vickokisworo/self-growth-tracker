import React from "react";
import GoalProgress from "./GoalProgress";
import { formatDisplayDate } from "../../utils/helpers";
import "./GoalList.css";

const GoalList = ({ goals, onEdit, onDelete, onRefresh }) => {
  if (goals.length === 0) {
    return (
      <div className="empty-state">
        <p>No goals yet. Set your first goal and start achieving!</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      in_progress: "#667eea",
      completed: "#27ae60",
      cancelled: "#e74c3c",
    };

    return (
      <span
        className="status-badge"
        style={{ backgroundColor: statusColors[status] }}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="goal-list">
      {goals.map((goal) => (
        <div key={goal.id} className="goal-card">
          <div className="goal-header">
            <div>
              <h3>{goal.title}</h3>
              {getStatusBadge(goal.status)}
            </div>
            {goal.deadline && (
              <div className="goal-deadline">
                📅 {formatDisplayDate(goal.deadline)}
              </div>
            )}
          </div>

          {goal.description && (
            <p className="goal-description">{goal.description}</p>
          )}

          {goal.why_important && (
            <div className="goal-why">
              <strong>Why it's important:</strong> {goal.why_important}
            </div>
          )}

          <GoalProgress
            goalId={goal.id}
            totalSteps={parseInt(goal.total_steps)}
            completedSteps={parseInt(goal.completed_steps)}
            onRefresh={onRefresh}
          />

          <div className="goal-actions">
            <button onClick={() => onEdit(goal)} className="btn-secondary">
              Edit
            </button>
            <button onClick={() => onDelete(goal.id)} className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalList;
