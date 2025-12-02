// frontend/src/components/Common/ThemeToggle.jsx
import React, { useState, useEffect } from "react";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.setAttribute(
      "data-theme",
      shouldBeDark ? "dark" : "light"
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light"
    );
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="toggle-track">
        <div className={`toggle-thumb ${isDark ? "dark" : "light"}`}>
          {isDark ? "🌙" : "☀️"}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
