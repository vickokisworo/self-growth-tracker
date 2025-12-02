// frontend/src/components/Common/QuickActions.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

const QuickActions = ({ onAddTodo, onAddHabit, onAddGoal, onAddJournal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: "✓",
      label: "Add Todo",
      color: "#0066ff",
      action: onAddTodo,
    },
    {
      icon: "🎯",
      label: "New Goal",
      color: "#10b981",
      action: onAddGoal,
    },
    {
      icon: "✅",
      label: "Add Habit",
      color: "#00c9a7",
      action: onAddHabit,
    },
    {
      icon: "📝",
      label: "Write Journal",
      color: "#f59e0b",
      action: onAddJournal,
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    if (action) {
      action();
    }
    setIsOpen(false);
  };

  return (
    <div className="quick-actions">
      {/* Action Buttons */}
      {isOpen && (
        <div className="actions-menu">
          {actions.map((action, index) => (
            <button
              key={index}
              className="action-button"
              style={{
                backgroundColor: action.color,
                animationDelay: `${index * 0.05}s`,
              }}
              onClick={() => handleAction(action.action)}
              title={action.label}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        className={`fab-button ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Quick actions"
      >
        <span className="fab-icon">+</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fab-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default QuickActions;
