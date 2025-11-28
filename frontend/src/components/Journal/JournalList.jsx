import React from "react";
import { formatDisplayDate } from "../../utils/helpers";
import "./JournalList.css";

const JournalList = ({ journals, onEdit, onDelete }) => {
  if (journals.length === 0) {
    return (
      <div className="empty-state">
        <p>No journal entries yet. Start reflecting on your day!</p>
      </div>
    );
  }

  return (
    <div className="journal-list">
      {journals.map((journal) => (
        <div key={journal.id} className="journal-card">
          <div className="journal-header">
            <div>
              <h3>{formatDisplayDate(journal.date)}</h3>
              {journal.mood && (
                <span className="mood-badge">{journal.mood}</span>
              )}
            </div>
          </div>

          <div className="journal-content">
            {journal.grateful_for && (
              <div className="journal-section">
                <h4>🙏 Grateful For</h4>
                <p>{journal.grateful_for}</p>
              </div>
            )}

            {journal.what_went_well && (
              <div className="journal-section">
                <h4>✅ What Went Well</h4>
                <p>{journal.what_went_well}</p>
              </div>
            )}

            {journal.what_to_improve && (
              <div className="journal-section">
                <h4>📈 To Improve</h4>
                <p>{journal.what_to_improve}</p>
              </div>
            )}

            {journal.notes && (
              <div className="journal-section">
                <h4>📝 Notes</h4>
                <p>{journal.notes}</p>
              </div>
            )}
          </div>

          <div className="journal-actions">
            <button onClick={() => onEdit(journal)} className="btn-secondary">
              Edit
            </button>
            <button onClick={() => onDelete(journal.id)} className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JournalList;
