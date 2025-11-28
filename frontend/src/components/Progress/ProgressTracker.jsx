import React, { useState, useEffect } from "react";
import { progressService } from "../../services/progressService";
import ProgressList from "./ProgressList";
import ProgressForm from "./ProgressForm";
import Loading from "../Common/Loading";
import "./ProgressTracker.css";

const ProgressTracker = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await progressService.getAll();
      setProgress(data.progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProgress(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingProgress(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this progress entry?")
    ) {
      try {
        await progressService.delete(id);
        fetchProgress();
      } catch (error) {
        console.error("Error deleting progress:", error);
      }
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingProgress(null);
    fetchProgress();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProgress(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="progress-tracker">
      <div className="page-header">
        <h1>Progress Tracker</h1>
        <button onClick={handleAdd} className="btn-primary">
          + Add Progress
        </button>
      </div>

      {showForm && (
        <ProgressForm
          progress={editingProgress}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <ProgressList
        progress={progress}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProgressTracker;
