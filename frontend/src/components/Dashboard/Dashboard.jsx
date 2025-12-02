// frontend/src/components/Dashboard/Dashboard.jsx
// Ini adalah upgrade dari Dashboard.jsx dengan fitur-fitur baru

import React, { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import { todoService } from "../../services/todoService";
import { goalService } from "../../services/goalService";
import StatsCard from "./StatsCard";
import ProgressChart from "./ProgressChart";
import Loading from "../Common/Loading";
import { Link } from "react-router-dom";
import AchievementBadge from "./AchievementBadge";
import Confetti, { useConfetti } from "../Common/Confetti";
import QuickActions from "../Common/QuickActions";
import ThemeToggle from "../Common/ThemeToggle";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [todoStats, setTodoStats] = useState(null);
  const [recentGoals, setRecentGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const { trigger, celebrate } = useConfetti();

  useEffect(() => {
    fetchAllData();
    setGreeting(getGreeting());
  }, []);

  const fetchAllData = async () => {
    try {
      const [dashData, todoData, goalsData] = await Promise.all([
        dashboardService.getStats(),
        todoService.getStats(),
        goalService.getAll(),
      ]);

      setStats(dashData);
      setTodoStats(todoData.stats);
      setRecentGoals(goalsData.goals.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greetings = {
      morning: ["Good Morning", "Rise & Shine", "Hello Sunshine"],
      afternoon: ["Good Afternoon", "Keep Going", "You're Doing Great"],
      evening: ["Good Evening", "Almost There", "Great Job Today"],
    };

    let timeOfDay = "morning";
    if (hour >= 12 && hour < 18) timeOfDay = "afternoon";
    if (hour >= 18) timeOfDay = "evening";

    const messages = greetings[timeOfDay];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Every accomplishment starts with the decision to try.",
      "Your only limit is you.",
      "Dream bigger. Do bigger.",
      "Success doesn't just find you. You have to go out and get it.",
      "Great things never come from comfort zones.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  if (loading) return <Loading />;

  const todoProgress = todoStats
    ? (todoStats.completed / todoStats.total) * 100 || 0
    : 0;
  const goalProgress =
    recentGoals.length > 0
      ? recentGoals.reduce(
          (acc, g) => acc + ((g.completed_steps / g.total_steps) * 100 || 0),
          0
        ) / recentGoals.length
      : 0;

  return (
    <div className="dashboard">
      <Confetti trigger={trigger} />

      {/* Hero Section with Theme Toggle */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="animated-gradient">{greeting}! 👋</h1>
            <p className="hero-quote">{getMotivationalQuote()}</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Stats Grid dengan Animasi */}
      <div className="stats-grid animated-cards">
        <StatsCard
          title="Today's Tasks"
          value={todoStats?.today || 0}
          subtitle={`${todoStats?.pending || 0} pending`}
          color="#0066ff"
          icon="📋"
          link="/todos"
          trend="+12%"
        />
        <StatsCard
          title="Active Habits"
          value={stats?.habits?.active_habits || 0}
          subtitle={`${Math.round(stats?.habits?.completion_rate || 0)}% done`}
          color="#00c9a7"
          icon="✅"
          link="/habits"
          trend="+8%"
        />
        <StatsCard
          title="Goals Progress"
          value={`${Math.round(stats?.goals?.avg_progress || 0)}%`}
          subtitle={`${stats?.goals?.in_progress_goals || 0} active`}
          color="#10b981"
          icon="🎯"
          link="/goals"
          trend="+15%"
        />
        <StatsCard
          title="Journal Streak"
          value={stats?.journals?.entries_this_week || 0}
          subtitle="days this week"
          color="#f59e0b"
          icon="📝"
          link="/journal"
          trend="+5%"
        />
      </div>

      {/* Achievement Badges */}
      <AchievementBadge
        stats={{
          todos: todoStats,
          habits: stats?.habits,
          goals: stats?.goals,
        }}
      />

      {/* Progress Chart dengan Hover Effects */}
      {stats?.progress?.trend && stats.progress.trend.length > 0 && (
        <div className="chart-section glass-effect">
          <div className="section-header">
            <h2>📈 Your Progress Journey</h2>
            <span className="chart-period">Last 14 Days</span>
          </div>
          <ProgressChart data={stats.progress.trend} />
        </div>
      )}

      {/* Dashboard Grid dengan Cards yang lebih menarik */}
      <div className="dashboard-grid">
        {/* Today's Focus dengan Progress Ring */}
        <div className="dashboard-card glass-effect hover-lift">
          <div className="card-header">
            <h3>📅 Today's Focus</h3>
            <Link to="/todos" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="progress-ring-container">
            <svg className="progress-ring" width="140" height="140">
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="var(--border-light)"
                strokeWidth="10"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
                strokeDasharray={`${todoProgress * 3.77} 377`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                className="progress-circle"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              <text
                x="70"
                y="70"
                textAnchor="middle"
                dy="0.3em"
                fontSize="32"
                fontWeight="700"
                fill="var(--text-primary)"
              >
                {Math.round(todoProgress)}%
              </text>
            </svg>
          </div>
          <p className="focus-text">Tasks Completion Rate</p>
          {todoProgress === 100 && (
            <button className="celebrate-btn" onClick={celebrate}>
              🎉 Celebrate!
            </button>
          )}
        </div>

        {/* Active Goals dengan Progress Bars */}
        <div className="dashboard-card glass-effect hover-lift">
          <div className="card-header">
            <h3>🎯 Active Goals</h3>
            <Link to="/goals" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="goals-list">
            {recentGoals.length > 0 ? (
              recentGoals.map((goal) => (
                <div key={goal.id} className="goal-item animated-item">
                  <div className="goal-info">
                    <span className="goal-title">{goal.title}</span>
                    <span className="goal-progress">
                      {goal.completed_steps}/{goal.total_steps}
                    </span>
                  </div>
                  <div className="mini-progress-bar">
                    <div
                      className="mini-progress-fill"
                      style={{
                        width: `${
                          (goal.completed_steps / goal.total_steps) * 100 || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-text">No active goals yet!</p>
            )}
          </div>
        </div>

        {/* Quick Stats dengan Icon Animations */}
        <div className="dashboard-card glass-effect hover-lift">
          <div className="card-header">
            <h3>📊 This Week</h3>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-icon animated-icon">✅</span>
              <div>
                <div className="quick-stat-value">
                  {Math.round(stats?.habits?.completion_rate || 0)}%
                </div>
                <div className="quick-stat-label">Habits Done</div>
              </div>
            </div>
            <div className="quick-stat">
              <span className="stat-icon animated-icon">✓</span>
              <div>
                <div className="quick-stat-value">
                  {todoStats?.completed || 0}
                </div>
                <div className="quick-stat-label">Tasks Done</div>
              </div>
            </div>
            <div className="quick-stat">
              <span className="stat-icon animated-icon">🎯</span>
              <div>
                <div className="quick-stat-value">
                  {Math.round(goalProgress)}%
                </div>
                <div className="quick-stat-label">Goal Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview dengan Animated Bars */}
      {stats?.progress?.categories && stats.progress.categories.length > 0 && (
        <div className="progress-overview glass-effect">
          <h2>🎨 Progress by Category</h2>
          {stats.progress.categories.map((item, index) => (
            <div
              key={item.category}
              className="progress-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="category-name">{item.category}</span>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(item.avg_rating / 10) * 100}%` }}
                />
              </div>
              <span className="progress-value">
                {Number(item.avg_rating).toFixed(1)}/10
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions FAB */}
      <QuickActions
        onAddTodo={() => (window.location.href = "/todos")}
        onAddHabit={() => (window.location.href = "/habits")}
        onAddGoal={() => (window.location.href = "/goals")}
        onAddJournal={() => (window.location.href = "/journal")}
      />
    </div>
  );
};

export default Dashboard;
