// frontend/src/components/Goals/GoalProgress.jsx - REAL-TIME STEP COMPLETION
import React, { useState, useEffect } from "react";
import { goalService } from "../../services/goalService";
import "./GoalProgress.css";

const GoalProgress = ({ goalId, totalSteps, completedSteps, onRefresh }) => {
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState("");
  const [showAddStep, setShowAddStep] = useState(false);
  const [updatingStep, setUpdatingStep] = useState(null);
  const [localProgress, setLocalProgress] = useState({
    total: totalSteps,
    completed: completedSteps,
  });

  useEffect(() => {
    if (goalId) {
      fetchSteps();
    }
  }, [goalId]);

  useEffect(() => {
    // Update local progress when props change
    setLocalProgress({
      total: totalSteps,
      completed: completedSteps,
    });
  }, [totalSteps, completedSteps]);

  const fetchSteps = async () => {
    try {
      const data = await goalService.getById(goalId);
      setSteps(data.goal.steps || []);
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  };

  const calculateProgress = () => {
    if (localProgress.total === 0) return 0;
    return Math.round((localProgress.completed / localProgress.total) * 100);
  };

  const handleAddStep = async () => {
    if (!newStep.trim()) return;

    try {
      await goalService.addStep(goalId, {
        step_title: newStep,
        order_number: steps.length + 1,
      });

      // Update local progress immediately (total increases, percentage decreases)
      setLocalProgress((prev) => ({
        total: prev.total + 1,
        completed: prev.completed,
      }));

      setNewStep("");
      setShowAddStep(false);

      // Fetch updated steps
      await fetchSteps();

      // Refresh parent to get accurate data from server
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error adding step:", error);
      alert("Failed to add step. Please try again.");
    }
  };

  const handleToggleStep = async (stepId, currentStatus) => {
    const newStatus = !currentStatus;

    // Set loading state
    setUpdatingStep(stepId);

    try {
      // Update local state immediately for instant UI feedback
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, completed: newStatus } : step
        )
      );

      // Update local progress count
      setLocalProgress((prev) => ({
        total: prev.total,
        completed: newStatus ? prev.completed + 1 : prev.completed - 1,
      }));

      // Update on server
      await goalService.updateStep(stepId, newStatus);

      // Refresh parent to sync with server
      if (onRefresh) {
        await onRefresh();
      }

      // Check if all steps completed
      const updatedSteps = steps.map((step) =>
        step.id === stepId ? { ...step, completed: newStatus } : step
      );

      const allCompleted = updatedSteps.every((step) => step.completed);

      if (allCompleted && updatedSteps.length > 0 && newStatus) {
        setTimeout(() => {
          if (
            window.confirm(
              "🎉 Congratulations! All steps completed!\n\nMark this goal as completed?"
            )
          ) {
            updateGoalStatus("completed");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error updating step:", error);

      // Revert on error
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, completed: currentStatus } : step
        )
      );

      setLocalProgress((prev) => ({
        total: prev.total,
        completed: currentStatus ? prev.completed + 1 : prev.completed - 1,
      }));

      alert("Failed to update step. Please try again.");
    } finally {
      setUpdatingStep(null);
    }
  };

  const updateGoalStatus = async (status) => {
    try {
      await goalService.update(goalId, { status });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating goal status:", error);
      alert("Failed to update goal status.");
    }
  };

  const handleDeleteStep = async (stepId) => {
    if (!window.confirm("Delete this step?")) return;

    try {
      // Check if step was completed
      const deletedStep = steps.find((s) => s.id === stepId);
      const wasCompleted = deletedStep?.completed || false;

      // Update local progress immediately
      setLocalProgress((prev) => ({
        total: prev.total - 1,
        completed: wasCompleted ? prev.completed - 1 : prev.completed,
      }));

      // Delete from server
      await goalService.deleteStep(stepId);

      // Update local steps list
      setSteps((prevSteps) => prevSteps.filter((step) => step.id !== stepId));

      // Refresh parent
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error deleting step:", error);
      alert("Failed to delete step. Please try again.");

      // Refresh to get accurate state
      if (onRefresh) onRefresh();
    }
  };

  const progress = calculateProgress();

  return (
    <div className="goal-progress">
      <div className="progress-header">
        <span>
          Progress: {localProgress.completed} / {localProgress.total} steps
        </span>
        <span className="progress-percentage">{progress}%</span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {steps.length > 0 && (
        <div className="steps-list">
          {steps.map((step) => (
            <div key={step.id} className="step-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => handleToggleStep(step.id, step.completed)}
                  disabled={updatingStep === step.id}
                />
                <span className={step.completed ? "completed" : ""}>
                  {updatingStep === step.id ? "Updating..." : step.step_title}
                </span>
              </label>
              <button
                onClick={() => handleDeleteStep(step.id)}
                className="delete-step-btn"
                title="Delete step"
                disabled={updatingStep === step.id}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddStep ? (
        <div className="add-step-form">
          <input
            type="text"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            placeholder="Enter step title..."
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter") handleAddStep();
            }}
          />
          <div className="add-step-actions">
            <button onClick={handleAddStep} className="btn-primary-small">
              Add
            </button>
            <button
              onClick={() => {
                setShowAddStep(false);
                setNewStep("");
              }}
              className="btn-secondary-small"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddStep(true)} className="btn-add-step">
          + Add Step
        </button>
      )}
    </div>
  );
};

export default GoalProgress;
