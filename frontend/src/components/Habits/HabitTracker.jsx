// frontend/src/components/Habits/HabitTracker.jsx - FIXED
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
      // Don't need to refresh all habits, just the streak
    } catch (error) {
      console.error("Error logging habit:", error);
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

  if (loading) return <Loading />;

  return (
    <div className="habit-tracker">
      <div className="page-header">
        <h1>Habit Tracker</h1>
        <button onClick={handleAdd} className="btn-primary">
          Add Habit
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
        habits={habits}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
};

export default HabitTracker;
