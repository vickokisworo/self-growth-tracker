// frontend/src/components/Dashboard/AchievementBadge.jsx
import React, { useState, useEffect } from "react";
import "./AchievementBadge.css";

const ACHIEVEMENTS = [
  {
    id: "first_todo",
    icon: "✅",
    title: "First Step",
    description: "Complete your first todo",
    color: "#10b981",
  },
  {
    id: "week_streak",
    icon: "🔥",
    title: "On Fire!",
    description: "7 day habit streak",
    color: "#f59e0b",
  },
  {
    id: "goal_master",
    icon: "🎯",
    title: "Goal Master",
    description: "Complete 5 goals",
    color: "#3b82f6",
  },
  {
    id: "early_bird",
    icon: "🌅",
    title: "Early Bird",
    description: "Log journal before 8 AM",
    color: "#8b5cf6",
  },
  {
    id: "consistency_king",
    icon: "👑",
    title: "Consistency King",
    description: "30 day login streak",
    color: "#ef4444",
  },
  {
    id: "progress_pro",
    icon: "📈",
    title: "Progress Pro",
    description: "Track 50 progress entries",
    color: "#06b6d4",
  },
];

const AchievementBadge = ({ stats }) => {
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    checkAchievements();
  }, [stats]);

  const checkAchievements = () => {
    const unlocked = [];
    const savedBadges = JSON.parse(
      localStorage.getItem("achievements") || "[]"
    );

    // Check first todo
    if (stats?.todos?.completed > 0 && !savedBadges.includes("first_todo")) {
      unlocked.push("first_todo");
    }

    // Check habit streak
    if (
      stats?.habits?.max_streak >= 7 &&
      !savedBadges.includes("week_streak")
    ) {
      unlocked.push("week_streak");
    }

    // Check goals completed
    if (stats?.goals?.completed >= 5 && !savedBadges.includes("goal_master")) {
      unlocked.push("goal_master");
    }

    // Show notification for new badges
    if (unlocked.length > 0) {
      const newBadgeId = unlocked[0];
      const badge = ACHIEVEMENTS.find((a) => a.id === newBadgeId);
      setNewBadge(badge);
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 5000);

      // Save to localStorage
      const updatedBadges = [...savedBadges, ...unlocked];
      localStorage.setItem("achievements", JSON.stringify(updatedBadges));
    }

    setUnlockedBadges([...savedBadges, ...unlocked]);
  };

  return (
    <>
      {/* Achievement Notification */}
      {showNotification && newBadge && (
        <div className="achievement-notification">
          <div className="achievement-content">
            <div
              className="achievement-icon-large"
              style={{ background: newBadge.color }}
            >
              {newBadge.icon}
            </div>
            <div className="achievement-text">
              <h3>🎉 Achievement Unlocked!</h3>
              <h4>{newBadge.title}</h4>
              <p>{newBadge.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Badges Display */}
      <div className="badges-container">
        <h3>🏆 Your Achievements</h3>
        <div className="badges-grid">
          {ACHIEVEMENTS.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`badge-card ${isUnlocked ? "unlocked" : "locked"}`}
                title={badge.description}
              >
                <div
                  className="badge-icon"
                  style={{
                    background: isUnlocked ? badge.color : "#d1d5db",
                    filter: isUnlocked ? "none" : "grayscale(100%)",
                  }}
                >
                  {badge.icon}
                </div>
                <div className="badge-info">
                  <h4>{badge.title}</h4>
                  <p>{badge.description}</p>
                </div>
                {isUnlocked && <div className="badge-checkmark">✓</div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AchievementBadge;
