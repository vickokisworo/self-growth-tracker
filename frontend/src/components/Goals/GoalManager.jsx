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

  if (loading) return <Loading />;

  return (
    <div className="goal-manager">
      <div className="page-header">
        <h1>Goal Manager</h1>
        <button onClick={handleAdd} className="btn-primary">
          + Add Goal
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
        goals={goals}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchGoals}
      />
    </div>
  );
};

export default GoalManager;
