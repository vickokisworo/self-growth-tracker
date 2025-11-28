import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/Common/ProtectedRoute";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import Dashboard from "./components/Dashboard/Dashboard";
import TodoList from "./components/Todos/TodoList";
import ProgressTracker from "./components/Progress/ProgressTracker";
import HabitTracker from "./components/Habits/HabitTracker";
import GoalManager from "./components/Goals/GoalManager";
import DailyJournal from "./components/Journal/DailyJournal";

import "./App.css";

// Layout utama setelah login
function MainLayout() {
  useEffect(() => {
    // Add mobile class detection
    const updateMobileClass = () => {
      if (window.innerWidth <= 768) {
        document.body.classList.add("mobile-view");
      } else {
        document.body.classList.remove("mobile-view");
      }
    };

    updateMobileClass();
    window.addEventListener("resize", updateMobileClass);

    return () => {
      window.removeEventListener("resize", updateMobileClass);
    };
  }, []);

  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Prevent zoom on mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      );
    }

    // Add touch event listener for better mobile experience
    document.addEventListener("touchstart", () => {}, { passive: true });

    // Detect mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      document.documentElement.classList.add("mobile-device");
    }

    // Detect standalone mode (PWA)
    if (
      window.navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      document.documentElement.classList.add("standalone-mode");
    }

    return () => {
      document.removeEventListener("touchstart", () => {});
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Halaman Login & Register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Halaman yang butuh login */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="todos" element={<TodoList />} />
            <Route path="progress" element={<ProgressTracker />} />
            <Route path="habits" element={<HabitTracker />} />
            <Route path="goals" element={<GoalManager />} />
            <Route path="journal" element={<DailyJournal />} />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
