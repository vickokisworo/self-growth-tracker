// frontend/src/components/Goals/GoalProgress.jsx - AUTO UPDATE PROGRESS
import React, { useState, useEffect } from "react";
import { goalService } from "../../services/goalService";
import { calculateProgress } from "../../utils/helpers";
import "./GoalProgress.css";

const GoalProgress = ({ goalId, totalSteps, completedSteps, onRefresh }) => {
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState("");
  const [showAddStep, setShowAddStep] = useState(false);

  useEffect(() => {
    if (goalId) {
      fetchSteps();
    }
  }, [goalId]);

  const fetchSteps = async () => {
    try {
      const data = await goalService.getById(goalId);
      setSteps(data.steps || []);
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  };

  const handleAddStep = async () => {
    if (!newStep.trim()) return;

    try {
      await goalService.addStep(goalId, {
        step_title: newStep,
        order_number: steps.length + 1,
      });
      setNewStep("");
      setShowAddStep(false);
      fetchSteps();
      onRefresh();
    } catch (error) {
      console.error("Error adding step:", error);
    }
  };

  const handleToggleStep = async (stepId, completed) => {
    try {
      await goalService.updateStep(stepId, completed);

      // Optimistic update
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, completed } : step
        )
      );

      // Refresh goal data to update progress
      onRefresh();

      // Check if all steps completed
      const updatedSteps = steps.map((step) =>
        step.id === stepId ? { ...step, completed } : step
      );
      const allCompleted = updatedSteps.every((step) => step.completed);

      if (allCompleted && updatedSteps.length > 0) {
        // Auto-complete goal
        setTimeout(() => {
          if (
            window.confirm("All steps completed! Mark this goal as completed?")
          ) {
            updateGoalStatus("completed");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  const updateGoalStatus = async (status) => {
    try {
      await goalService.update(goalId, { status });
      onRefresh();
    } catch (error) {
      console.error("Error updating goal status:", error);
    }
  };

  const progress = calculateProgress(completedSteps, totalSteps);

  return (
    <div className="goal-progress">
      <div className="progress-header">
        <span>
          Progress: {completedSteps} / {totalSteps} steps
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
                  onChange={(e) => handleToggleStep(step.id, e.target.checked)}
                />
                <span className={step.completed ? "completed" : ""}>
                  {step.step_title}
                </span>
              </label>
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
