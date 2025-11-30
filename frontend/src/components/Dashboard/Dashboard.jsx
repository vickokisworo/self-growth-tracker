// frontend/src/components/Dashboard/Dashboard.jsx - ENHANCED VERSION
import React, { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import { todoService } from "../../services/todoService";
import { goalService } from "../../services/goalService";
import StatsCard from "./StatsCard";
import ProgressChart from "./ProgressChart";
import Loading from "../Common/Loading";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [todoStats, setTodoStats] = useState(null);
  const [recentGoals, setRecentGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
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

  const getMotivationalMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️ Good morning! Start your day right.";
    if (hour < 18) return "🌤️ Good afternoon! Keep up the momentum.";
    return "🌙 Good evening! Reflect on your day.";
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
      <div className="welcome-banner">
        <h1>Welcome Back! 👋</h1>
        <p>{getMotivationalMessage()}</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Today's Tasks"
          value={todoStats?.today || 0}
          subtitle={`${todoStats?.pending || 0} pending tasks`}
          color="#0066ff"
          icon="📋"
          link="/todos"
        />
        <StatsCard
          title="Active Habits"
          value={stats?.habits?.active_habits || 0}
          subtitle={`${Math.round(
            stats?.habits?.completion_rate || 0
          )}% completion rate`}
          color="#00c9a7"
          icon="✅"
          link="/habits"
        />
        <StatsCard
          title="Goals Progress"
          value={`${Math.round(stats?.goals?.avg_progress || 0)}%`}
          subtitle={`${stats?.goals?.in_progress_goals || 0} goals in progress`}
          color="#10b981"
          icon="🎯"
          link="/goals"
        />
        <StatsCard
          title="Journal Entries"
          value={stats?.journals?.entries_this_week || 0}
          subtitle="entries this week"
          color="#f59e0b"
          icon="📝"
          link="/journal"
        />
      </div>

      {stats?.progress?.trend && stats.progress.trend.length > 0 && (
        <div className="chart-section">
          <h2>Progress Trend (Last 14 Days)</h2>
          <ProgressChart data={stats.progress.trend} />
        </div>
      )}

      <div className="dashboard-grid">
        {/* Today's Focus */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📅 Today's Focus</h3>
            <Link to="/todos" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="progress-ring">
            <svg width="120" height="120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#0066ff"
                strokeWidth="8"
                strokeDasharray={`${todoProgress * 3.39} 339`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{
                  transition: "stroke-dasharray 0.6s ease",
                }}
              />
              <text
                x="60"
                y="60"
                textAnchor="middle"
                dy="0.3em"
                fontSize="24"
                fontWeight="700"
                fill="#111827"
              >
                {Math.round(todoProgress)}%
              </text>
            </svg>
          </div>
          <p className="focus-text">Tasks Completion Rate</p>
        </div>

        {/* Recent Goals */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🎯 Active Goals</h3>
            <Link to="/goals" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="goals-list">
            {recentGoals.length > 0 ? (
              recentGoals.map((goal) => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-info">
                    <span className="goal-title">{goal.title}</span>
                    <span className="goal-progress">
                      {goal.completed_steps}/{goal.total_steps} steps
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
              <p className="empty-text">
                No active goals yet. Create your first goal!
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📊 This Week's Summary</h3>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-icon">✅</span>
              <div>
                <div className="quick-stat-value">
                  {stats?.habits?.completion_rate
                    ? Math.round(stats.habits.completion_rate)
                    : 0}
                  %
                </div>
                <div className="quick-stat-label">Habit Completion</div>
              </div>
            </div>
            <div className="quick-stat">
              <span className="stat-icon">✓</span>
              <div>
                <div className="quick-stat-value">
                  {todoStats?.completed || 0}
                </div>
                <div className="quick-stat-label">Tasks Completed</div>
              </div>
            </div>
            <div className="quick-stat">
              <span className="stat-icon">🎯</span>
              <div>
                <div className="quick-stat-value">
                  {Math.round(goalProgress)}%
                </div>
                <div className="quick-stat-label">Avg Goal Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats?.progress?.categories && stats.progress.categories.length > 0 && (
        <div className="progress-overview">
          <h2>Progress by Category</h2>
          {stats.progress.categories.map((item) => (
            <div key={item.category} className="progress-item">
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
    </div>
  );
};

export default Dashboard;
