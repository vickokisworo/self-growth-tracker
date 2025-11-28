import React, { useState, useEffect } from "react";
import { habitService } from "../../services/habitService";
import { HABIT_FREQUENCIES } from "../../utils/constants";
import ErrorMessage from "../Common/ErrorMessage";
import "../Progress/ProgressForm.css";

const HabitForm = ({ habit, onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [reminderTime, setReminderTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || "");
      setFrequency(habit.frequency);
      setReminderTime(habit.reminder_time || "");
    }
  }, [habit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        name,
        description,
        frequency,
        reminder_time: reminderTime || null,
      };

      if (habit) {
        await habitService.update(habit.id, { ...data, is_active: true });
      } else {
        await habitService.create(data);
      }

      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h2>{habit ? "Edit Habit" : "Add Habit"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Habit Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Morning Exercise"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Describe your habit..."
            />
          </div>

          <div className="form-group">
            <label>Frequency *</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            >
              {HABIT_FREQUENCIES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reminder Time (Optional)</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
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

export default HabitForm;
