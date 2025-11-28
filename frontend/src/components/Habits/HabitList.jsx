// frontend/src/components/Habits/HabitList.jsx - FIXED
import React, { useState, useEffect } from 'react';
import HabitStreak from './HabitStreak';
import './HabitList.css';

const HabitList = ({ habits, onEdit, onDelete, onToggle }) => {
  const [todayLogs, setTodayLogs] = useState({});
  const [streaks, setStreaks] = useState({});

  useEffect(() => {
    // Check today's logs for each habit
    const checkTodayLogs = async () => {
      const logs = {};
      for (const habit of habits) {
        try {
          const today = new Date().toISOString().split('T')[0];
          const response = await fetch(
            `/api/habits/${habit.id}/logs?startDate=${today}&endDate=${today}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          const data = await response.json();
          if (data.success && data.data.logs.length > 0) {
            logs[habit.id] = data.data.logs[0].completed;
          }
        } catch (error) {
          console.error('Error checking today log:', error);
        }
      }
      setTodayLogs(logs);
    };

    if (habits.length > 0) {
      checkTodayLogs();
    }
  }, [habits]);

  const handleToggle = async (habitId) => {
    const isCurrentlyChecked = todayLogs[habitId] || false;
    
    // Optimistic update
    setTodayLogs(prev => ({
      ...prev,
      [habitId]: !isCurrentlyChecked
    }));

    // Call parent toggle
    await onToggle(habitId, !isCurrentlyChecked);
    
    // Refresh streak after toggle
    setTimeout(() => {
      setStreaks(prev => ({ ...prev, [habitId]: Date.now() }));
    }, 500);
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
      {habits.map((habit) => (
        <div key={habit.id} className="habit-card">
          <div className="habit-header">
            <div className="habit-info">
              <h3>{habit.name}</h3>
              {habit.description && (
                <p className="habit-description">{habit.description}</p>
              )}
              <div className="habit-meta">
                <span className="frequency-badge">{habit.frequency}</span>
                {habit.reminder_time && (
                  <span className="reminder-time">⏰ {habit.reminder_time}</span>
                )}
              </div>
            </div>
            {habit.frequency === 'daily' && (
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
              />
              <span className="checkmark"></span>
              <span>Complete Today</span>
            </label>
            <div className="action-buttons">
              <button onClick={() => onEdit(habit)} className="btn-secondary">
                Edit
              </button>
              <button onClick={() => onDelete(habit.id)} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;