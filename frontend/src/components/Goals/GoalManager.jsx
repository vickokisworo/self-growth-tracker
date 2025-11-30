// frontend/src/components/Goals/GoalManager.jsx - WITH ANIMATION
import React, { useState, useEffect } from "react";
import { goalService } from "../../services/goalService";
import GoalList from "./GoalList";
import GoalForm from "./GoalForm";
import Loading from "../Common/Loading";
import "./GoalManager.css";

const GoalManager = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState("all"); // all, in_progress, completed

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalService.getAll();
      setGoals(data.goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await goalService.delete(id);
        fetchGoals();
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingGoal(null);
    fetchGoals();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const getFilteredGoals = () => {
    if (filter === "all") return goals;
    return goals.filter((g) => g.status === filter);
  };

  const filteredGoals = getFilteredGoals();
  const inProgressCount = goals.filter(
    (g) => g.status === "in_progress"
  ).length;
  const completedCount = goals.filter((g) => g.status === "completed").length;
  const cancelledCount = goals.filter((g) => g.status === "cancelled").length;

  if (loading) return <Loading />;

  return (
    <div className="goal-manager">
      <div className="page-header">
        <div className="header-content">
          <h1>Goal Manager</h1>
          <p className="subtitle">Set goals, track progress, achieve dreams</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          + Add Goal
        </button>
      </div>

      {/* Status Filters */}
      <div className="goal-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Goals ({goals.length})
        </button>
        <button
          className={`filter-btn ${filter === "in_progress" ? "active" : ""}`}
          onClick={() => setFilter("in_progress")}
        >
          🎯 In Progress ({inProgressCount})
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          ✅ Completed ({completedCount})
        </button>
        <button
          className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
          onClick={() => setFilter("cancelled")}
        >
          ❌ Cancelled ({cancelledCount})
        </button>
      </div>

      {showForm && (
        <GoalForm
          goal={editingGoal}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <GoalList
        goals={filteredGoals}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchGoals}
      />
    </div>
  );
};

export default GoalManager;
