import React, { useState, useEffect } from "react";
import { habitService } from "../../services/habitService";
import "./HabitStreak.css";

const HabitStreak = ({ habitId }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchStreak();
  }, [habitId]);

  const fetchStreak = async () => {
    try {
      const data = await habitService.getStreak(habitId);
      setStreak(data.streak);
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  return (
    <div className="habit-streak">
      <div className="streak-icon">🔥</div>
      <div className="streak-info">
        <div className="streak-number">{streak}</div>
        <div className="streak-label">day streak</div>
      </div>
    </div>
  );
};

export default HabitStreak;
