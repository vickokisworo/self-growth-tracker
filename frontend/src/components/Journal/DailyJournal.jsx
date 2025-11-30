// frontend/src/components/Journal/DailyJournal.jsx - FIXED DATE SEARCH
import React, { useState, useEffect } from "react";
import { journalService } from "../../services/journalService";
import JournalList from "./JournalList";
import JournalForm from "./JournalForm";
import Loading from "../Common/Loading";
import "./DailyJournal.css";

const DailyJournal = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetchJournals();
  }, []);

  useEffect(() => {
    filterJournals();
  }, [searchDate, journals]);

  const fetchJournals = async () => {
    try {
      const data = await journalService.getAll();
      setJournals(data.journals);
      setFilteredJournals(data.journals);
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeDate = (dateString) => {
    // Convert to YYYY-MM-DD format for comparison
    const date = new Date(dateString);
    // Add timezone offset to get correct local date
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const filterJournals = () => {
    if (!searchDate) {
      setFilteredJournals(journals);
      return;
    }

    const searchDateNormalized = normalizeDate(searchDate);

    const filtered = journals.filter((journal) => {
      const journalDateNormalized = normalizeDate(journal.date);
      return journalDateNormalized === searchDateNormalized;
    });

    setFilteredJournals(filtered);
  };

  const handleAdd = () => {
    setEditingJournal(null);
    setShowForm(true);
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this journal entry?")) {
      try {
        await journalService.delete(id);
        fetchJournals();
      } catch (error) {
        console.error("Error deleting journal:", error);
      }
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingJournal(null);
    fetchJournals();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingJournal(null);
  };

  const clearSearch = () => {
    setSearchDate("");
  };

  const formatSearchDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="daily-journal">
      <div className="page-header">
        <div className="header-content">
          <h1>Daily Journal</h1>
          <p className="subtitle">
            {searchDate
              ? `Showing entries for ${formatSearchDate(searchDate)}`
              : `${journals.length} total entries`}
          </p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          + New Entry
        </button>
      </div>

      <div className="journal-search">
        <div className="search-group">
          <label htmlFor="search-date">🔍 Search by Date:</label>
          <input
            id="search-date"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="date-input"
          />
          {searchDate && (
            <button onClick={clearSearch} className="clear-search-btn">
              ✕ Clear
            </button>
          )}
        </div>
        {searchDate && (
          <div className="search-results">
            <span className="results-count">
              Found {filteredJournals.length}{" "}
              {filteredJournals.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        )}
      </div>

      {showForm && (
        <JournalForm
          journal={editingJournal}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {filteredJournals.length === 0 && searchDate ? (
        <div className="no-results">
          <div className="empty-icon">📝</div>
          <p>No journal entries found for {formatSearchDate(searchDate)}</p>
          <button onClick={clearSearch} className="btn-secondary">
            Show All Entries
          </button>
        </div>
      ) : (
        <JournalList
          journals={filteredJournals}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default DailyJournal;
