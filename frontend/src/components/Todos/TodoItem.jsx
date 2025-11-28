// frontend/src/components/Todos/TodoItem.jsx
import React from "react";
import "./TodoItem.css";

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          id={`todo-${todo.id}`}
        />
        <label htmlFor={`todo-${todo.id}`}></label>
      </div>

      <div className="todo-content">
        <div className="todo-main">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
        </div>

        <div className="todo-meta">
          <span className={`priority-badge ${getPriorityClass(todo.priority)}`}>
            {todo.priority}
          </span>
          {todo.due_date && (
            <span className="due-date">Due: {formatDate(todo.due_date)}</span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          onClick={() => onEdit(todo)}
          className="action-btn edit-btn"
          title="Edit"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="action-btn delete-btn"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
