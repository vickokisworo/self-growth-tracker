// frontend/src/components/Habits/HabitTracker.jsx - WITH DEBUG
import React, { useState, useEffect } from "react";
import { habitService } from "../../services/habitService";
import HabitList from "./HabitList";
import HabitForm from "./HabitForm";
import Loading from "../Common/Loading";
import "./HabitTracker.css";

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await habitService.getAll();
      console.log("📥 Fetched habits:", data);
      setHabits(data.habits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await habitService.delete(id);
        fetchHabits();
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    }
  };

  const handleToggle = async (habitId, completed) => {
    console.log("🎯 HabitTracker.handleToggle called:", {
      habitId,
      completed,
      timestamp: new Date().toISOString(),
    });

    try {
      const today = new Date().toISOString().split("T")[0];

      console.log("📅 Logging habit for date:", today);

      const logData = {
        completed,
        date: today,
        notes: "",
      };

      console.log("📤 Sending to API:", logData);

      const result = await habitService.logHabit(habitId, logData);

      console.log("✅ API Response:", result);

      // Don't refresh all habits, just let the child component verify
      // This avoids race conditions
      console.log("✓ Toggle completed successfully");
    } catch (error) {
      console.error("❌ Error in handleToggle:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error; // Re-throw to let child handle it
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingHabit(null);
    fetchHabits();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  const getFilteredHabits = () => {
    if (filter === "all") return habits;
    return habits.filter((h) => h.frequency === filter);
  };

  const filteredHabits = getFilteredHabits();
  const dailyCount = habits.filter((h) => h.frequency === "daily").length;
  const weeklyCount = habits.filter((h) => h.frequency === "weekly").length;
  const monthlyCount = habits.filter((h) => h.frequency === "monthly").length;

  if (loading) return <Loading />;

  return (
    <div className="habit-tracker">
      <div className="page-header">
        <div className="header-content">
          <h1>Habit Tracker</h1>
          <p className="subtitle">Build better habits, one day at a time</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          + Add Habit
        </button>
      </div>

      <div className="habit-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Habits ({habits.length})
        </button>
        <button
          className={`filter-btn ${filter === "daily" ? "active" : ""}`}
          onClick={() => setFilter("daily")}
        >
          📅 Daily ({dailyCount})
        </button>
        <button
          className={`filter-btn ${filter === "weekly" ? "active" : ""}`}
          onClick={() => setFilter("weekly")}
        >
          📆 Weekly ({weeklyCount})
        </button>
        <button
          className={`filter-btn ${filter === "monthly" ? "active" : ""}`}
          onClick={() => setFilter("monthly")}
        >
          🗓️ Monthly ({monthlyCount})
        </button>
      </div>

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <HabitList
        habits={filteredHabits}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />

      {/* Debug Panel (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "12px",
            maxWidth: "300px",
            zIndex: 9999,
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            🐛 Debug Info
          </div>
          <div>Total Habits: {habits.length}</div>
          <div>Filtered: {filteredHabits.length}</div>
          <div>Filter: {filter}</div>
          <div style={{ fontSize: "10px", marginTop: "5px", color: "#888" }}>
            Check browser console for detailed logs
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
