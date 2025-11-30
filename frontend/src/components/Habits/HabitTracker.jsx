// frontend/src/components/Habits/HabitTracker.jsx - COMPLETE FIX
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
  const [filter, setFilter] = useState("all"); // all, daily, weekly, monthly

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await habitService.getAll();
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
    try {
      const today = new Date().toISOString().split("T")[0];
      await habitService.logHabit(habitId, {
        completed,
        date: today,
      });
      // Refresh habits to update streaks
      fetchHabits();
    } catch (error) {
      console.error("Error logging habit:", error);
      throw error; // Re-throw untuk error handling di HabitList
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

      {/* Frequency Filters */}
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
    </div>
  );
};

export default HabitTracker;
