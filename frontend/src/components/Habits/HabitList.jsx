// frontend/src/components/Habits/HabitList.jsx - FIXED TOGGLE
import React, { useState, useEffect } from "react";
import HabitStreak from "./HabitStreak";
import "./HabitList.css";

const HabitList = ({ habits, onEdit, onDelete, onToggle }) => {
  const [todayLogs, setTodayLogs] = useState({});
  const [streaks, setStreaks] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    checkTodayLogs();
  }, [habits]);

  const checkTodayLogs = async () => {
    const logs = {};
    for (const habit of habits) {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/habits/${habit.id}/logs?startDate=${today}&endDate=${today}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success && data.data.logs.length > 0) {
          logs[habit.id] = data.data.logs[0].completed;
        } else {
          logs[habit.id] = false;
        }
      } catch (error) {
        console.error("Error checking today log:", error);
        logs[habit.id] = false;
      }
    }
    setTodayLogs(logs);
  };

  const handleToggle = async (habitId) => {
    const currentStatus = todayLogs[habitId] || false;
    const newStatus = !currentStatus;

    // Set loading state
    setLoading((prev) => ({ ...prev, [habitId]: true }));

    try {
      // Optimistic update
      setTodayLogs((prev) => ({
        ...prev,
        [habitId]: newStatus,
      }));

      // Call parent toggle
      await onToggle(habitId, newStatus);

      // Refresh streak after toggle
      setTimeout(() => {
        setStreaks((prev) => ({ ...prev, [habitId]: Date.now() }));
      }, 500);
    } catch (error) {
      console.error("Error toggling habit:", error);
      // Revert on error
      setTodayLogs((prev) => ({
        ...prev,
        [habitId]: currentStatus,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [habitId]: false }));
    }
  };

  // Group habits by frequency
  const groupedHabits = habits.reduce((acc, habit) => {
    const freq = habit.frequency || "daily";
    if (!acc[freq]) acc[freq] = [];
    acc[freq].push(habit);
    return acc;
  }, {});

  const frequencyOrder = ["daily", "weekly", "monthly"];
  const frequencyLabels = {
    daily: "📅 Daily Habits",
    weekly: "📆 Weekly Habits",
    monthly: "🗓️ Monthly Habits",
  };

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <p>No habits yet. Create your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {frequencyOrder.map((frequency) => {
        const frequencyHabits = groupedHabits[frequency];
        if (!frequencyHabits || frequencyHabits.length === 0) return null;

        return (
          <div key={frequency} className="habit-frequency-group">
            <h2 className="frequency-header">{frequencyLabels[frequency]}</h2>
            <div className="habit-cards">
              {frequencyHabits.map((habit) => (
                <div key={habit.id} className="habit-card">
                  <div className="habit-header">
                    <div className="habit-info">
                      <h3>{habit.name}</h3>
                      {habit.description && (
                        <p className="habit-description">{habit.description}</p>
                      )}
                      <div className="habit-meta">
                        <span className="frequency-badge">
                          {habit.frequency}
                        </span>
                        {habit.reminder_time && (
                          <span className="reminder-time">
                            ⏰ {habit.reminder_time}
                          </span>
                        )}
                      </div>
                    </div>
                    {habit.frequency === "daily" && (
                      <HabitStreak
                        habitId={habit.id}
                        key={streaks[habit.id] || habit.id}
                      />
                    )}
                  </div>

                  <div className="habit-actions">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={todayLogs[habit.id] || false}
                        onChange={() => handleToggle(habit.id)}
                        disabled={loading[habit.id]}
                      />
                      <span className="checkmark"></span>
                      <span>
                        {loading[habit.id]
                          ? "Updating..."
                          : todayLogs[habit.id]
                          ? "Completed Today ✓"
                          : "Complete Today"}
                      </span>
                    </label>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(habit)}
                        className="btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(habit.id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;
