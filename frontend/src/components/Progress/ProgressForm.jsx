import React, { useState, useEffect } from "react";
import { progressService } from "../../services/progressService";
import { PROGRESS_CATEGORIES } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import ErrorMessage from "../Common/ErrorMessage";
import "./ProgressForm.css";

const ProgressForm = ({ progress, onSubmit, onCancel }) => {
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (progress) {
      setCategory(progress.category);
      setRating(progress.rating);
      setNotes(progress.notes || "");
      setDate(formatDate(progress.date));
    }
  }, [progress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = { category, rating: parseInt(rating), notes, date };

      if (progress) {
        await progressService.update(progress.id, data);
      } else {
        await progressService.create(data);
      }

      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h2>{progress ? "Edit Progress" : "Add Progress"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {PROGRESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Rating (1-10) *</label>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
            <div className="rating-display">{rating}</div>
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add any notes about your progress..."
            />
          </div>

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

export default ProgressForm;
