import React, { useState, useEffect } from "react";
import { goalService } from "../../services/goalService";
import { GOAL_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import ErrorMessage from "../Common/ErrorMessage";
import "../Progress/ProgressForm.css";

const GoalForm = ({ goal, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [whyImportant, setWhyImportant] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || "");
      setWhyImportant(goal.why_important || "");
      setDeadline(goal.deadline ? formatDate(goal.deadline) : "");
      setStatus(goal.status);
    }
  }, [goal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        title,
        description,
        why_important: whyImportant,
        deadline: deadline || null,
        status,
      };

      if (goal) {
        await goalService.update(goal.id, data);
      } else {
        await goalService.create(data);
      }

      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h2>{goal ? "Edit Goal" : "Add Goal"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Goal Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Learn React.js"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Describe your goal..."
            />
          </div>

          <div className="form-group">
            <label>Why is this important?</label>
            <textarea
              value={whyImportant}
              onChange={(e) => setWhyImportant(e.target.value)}
              rows="2"
              placeholder="Why do you want to achieve this?"
            />
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {goal && (
            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {GOAL_STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <ErrorMessage message={error} />

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
