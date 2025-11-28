// frontend/src/components/Todos/TodoForm.jsx
import React, { useState, useEffect } from "react";
import { todoService } from "../../services/todoService";
import { formatDate } from "../../utils/helpers";
import ErrorMessage from "../Common/ErrorMessage";
import "./TodoForm.css";

const TodoForm = ({ todo, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setPriority(todo.priority);
      setDueDate(todo.due_date ? formatDate(todo.due_date) : "");
    }
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        title,
        description,
        priority,
        due_date: dueDate || null,
      };

      if (todo) {
        await todoService.update(todo.id, {
          ...data,
          completed: todo.completed,
        });
      } else {
        await todoService.create(data);
      }

      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{todo ? "Edit Task" : "New Task"}</h2>
          <button onClick={onCancel} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="due_date">Due Date</label>
              <input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <ErrorMessage message={error} />

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
