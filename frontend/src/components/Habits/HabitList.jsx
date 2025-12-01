// frontend/src/components/Habits/HabitList.jsx - DEBUG & FINAL FIX
import React, { useState, useEffect } from "react";
import HabitStreak from "./HabitStreak";
import api from "../../services/api";
import "./HabitList.css";

const HabitList = ({ habits, onEdit, onDelete, onToggle }) => {
  const [todayLogs, setTodayLogs] = useState({});
  const [streaks, setStreaks] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (habits.length > 0) {
      checkTodayLogs();
    }
  }, [habits]);

  const checkTodayLogs = async () => {
    const logs = {};
    const today = new Date().toISOString().split("T")[0];

    console.log("🔍 Checking today logs for date:", today);

    for (const habit of habits) {
      try {
        const response = await api.get(`/habits/${habit.id}/logs`, {
          params: {
            startDate: today,
            endDate: today,
          },
        });

        console.log(`📋 Habit ${habit.id} logs:`, response.data);

        if (response.data.success && response.data.data.logs.length > 0) {
          const log = response.data.data.logs[0];
          logs[habit.id] = log.completed;
          console.log(`✅ Habit ${habit.id} status:`, log.completed);
        } else {
          logs[habit.id] = false;
          console.log(`❌ Habit ${habit.id} has no log for today`);
        }
      } catch (error) {
        console.error(`❌ Error checking log for habit ${habit.id}:`, error);
        logs[habit.id] = false;
      }
    }

    console.log("📊 Final today logs:", logs);
    setTodayLogs(logs);
  };

  const handleToggle = async (habitId) => {
    const currentStatus = todayLogs[habitId] || false;
    const newStatus = !currentStatus;

    console.log("🔄 Toggle habit:", {
      habitId,
      currentStatus,
      newStatus,
    });

    // Set loading
    setLoading((prev) => ({ ...prev, [habitId]: true }));

    try {
      // Optimistic update
      setTodayLogs((prev) => {
        const updated = { ...prev, [habitId]: newStatus };
        console.log("🎨 Optimistic UI update:", updated);
        return updated;
      });

      // Call parent function (which calls API)
      console.log("📡 Calling API through parent...");
      await onToggle(habitId, newStatus);

      console.log("✅ API call successful");

      // Wait a bit then refresh to verify
      setTimeout(async () => {
        console.log("🔄 Re-checking logs to verify...");
        await checkTodayLogs();
      }, 500);

      // Refresh streak
      setTimeout(() => {
        setStreaks((prev) => ({ ...prev, [habitId]: Date.now() }));
      }, 300);
    } catch (error) {
      console.error("❌ Toggle error:", error);

      // Revert on error
      setTodayLogs((prev) => {
        const reverted = { ...prev, [habitId]: currentStatus };
        console.log("↩️ Reverting to:", reverted);
        return reverted;
      });

      alert("Failed to update habit. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [habitId]: false }));
    }
  };

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✅</div>
        <p>No habits yet. Create your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map((habit, index) => {
        const isChecked = todayLogs[habit.id] || false;
        const isLoading = loading[habit.id] || false;

        return (
          <div
            key={habit.id}
            className="habit-card"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: "slideIn 0.5s ease-out forwards",
              opacity: 0,
            }}
          >
            <div className="habit-header">
              <div className="habit-info">
                <h3>{habit.name}</h3>
                {habit.description && (
                  <p className="habit-description">{habit.description}</p>
                )}
                <div className="habit-meta">
                  <span className="frequency-badge">{habit.frequency}</span>
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
                  checked={isChecked}
                  onChange={() => handleToggle(habit.id)}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                <span className={isChecked ? "completed-text" : ""}>
                  {isLoading
                    ? "Updating..."
                    : isChecked
                    ? "Completed Today ✓"
                    : "Complete Today"}
                </span>
              </label>
              <div className="action-buttons">
                <button
                  onClick={() => onEdit(habit)}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(habit.id)}
                  className="btn-danger"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === "development" && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#999",
                  marginTop: "10px",
                  padding: "8px",
                  background: "#f5f5f5",
                  borderRadius: "5px",
                }}
              >
                Debug: Habit {habit.id} | Status:{" "}
                {isChecked ? "Checked ✓" : "Unchecked ○"} | Loading:{" "}
                {isLoading ? "Yes" : "No"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;
