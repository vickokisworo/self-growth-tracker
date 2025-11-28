// frontend/src/components/Todos/TodoList.jsx - TODAY'S TASKS FOCUSED
import React, { useState, useEffect } from "react";
import { todoService } from "../../services/todoService";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import Loading from "../Common/Loading";
import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [view, setView] = useState("today"); // today, all, completed
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    today: 0,
  });

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAll();
      setTodos(data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await todoService.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    const itemDate = new Date(date);
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  };

  const getFilteredTodos = () => {
    if (view === "today") {
      return todos.filter(
        (todo) => isToday(todo.created_at) && !todo.completed
      );
    } else if (view === "all") {
      return todos.filter(
        (todo) => !isToday(todo.created_at) || todo.completed
      );
    } else if (view === "completed") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  };

  const handleAdd = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await todoService.delete(id);
        fetchTodos();
        fetchStats();
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await todoService.toggleComplete(id);
      fetchTodos();
      fetchStats();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTodo(null);
    fetchTodos();
    fetchStats();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleClearCompleted = async () => {
    if (window.confirm("Delete all completed tasks?")) {
      try {
        await todoService.deleteCompleted();
        fetchTodos();
        fetchStats();
      } catch (error) {
        console.error("Error clearing completed:", error);
      }
    }
  };

  const filteredTodos = getFilteredTodos();
  const todayCount = todos.filter(
    (t) => isToday(t.created_at) && !t.completed
  ).length;
  const otherCount = todos.filter(
    (t) => !isToday(t.created_at) && !t.completed
  ).length;

  if (loading) return <Loading />;

  return (
    <div className="todo-list-container">
      <div className="todo-header">
        <div className="header-content">
          <h1>Daily To-Do List</h1>
          <p className="subtitle">Stay focused on today's priorities</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          Add Task
        </button>
      </div>

      <div className="todo-stats">
        <div className="stat-card stat-today">
          <span className="stat-value">{todayCount}</span>
          <span className="stat-label">Today</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-value">{otherCount}</span>
          <span className="stat-label">Other Days</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="todo-filters">
        <button
          className={`filter-btn ${view === "today" ? "active" : ""}`}
          onClick={() => setView("today")}
        >
          Today ({todayCount})
        </button>
        <button
          className={`filter-btn ${view === "all" ? "active" : ""}`}
          onClick={() => setView("all")}
        >
          Other Tasks ({otherCount})
        </button>
        <button
          className={`filter-btn ${view === "completed" ? "active" : ""}`}
          onClick={() => setView("completed")}
        >
          Completed ({stats.completed})
        </button>
        {stats.completed > 0 && (
          <button className="clear-btn" onClick={handleClearCompleted}>
            Clear Completed
          </button>
        )}
      </div>

      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <div className="todos-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <p>
              {view === "today"
                ? "No tasks for today. You're all set!"
                : view === "completed"
                ? "No completed tasks yet."
                : "No other tasks."}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
