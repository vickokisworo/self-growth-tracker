import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ProgressTracker from "./components/Progress/ProgressTracker";
import HabitTracker from "./components/Habits/HabitTracker";
import GoalManager from "./components/Goals/GoalManager";
import DailyJournal from "./components/Journal/DailyJournal";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Sidebar />
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/progress" element={<ProgressTracker />} />
                      <Route path="/habits" element={<HabitTracker />} />
                      <Route path="/goals" element={<GoalManager />} />
                      <Route path="/journal" element={<DailyJournal />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
