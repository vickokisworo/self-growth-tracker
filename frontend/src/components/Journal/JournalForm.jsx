import React, { useState, useEffect } from "react";
import { journalService } from "../../services/journalService";
import { MOODS } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import ErrorMessage from "../Common/ErrorMessage";
import "../Progress/ProgressForm.css";

const JournalForm = ({ journal, onSubmit, onCancel }) => {
  const [date, setDate] = useState(formatDate(new Date()));
  const [mood, setMood] = useState("");
  const [gratefulFor, setGratefulFor] = useState("");
  const [whatWentWell, setWhatWentWell] = useState("");
  const [whatToImprove, setWhatToImprove] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (journal) {
      setDate(formatDate(journal.date));
      setMood(journal.mood || "");
      setGratefulFor(journal.grateful_for || "");
      setWhatWentWell(journal.what_went_well || "");
      setWhatToImprove(journal.what_to_improve || "");
      setNotes(journal.notes || "");
    }
  }, [journal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        date,
        mood,
        grateful_for: gratefulFor,
        what_went_well: whatWentWell,
        what_to_improve: whatToImprove,
        notes,
      };

      if (journal) {
        await journalService.update(journal.id, data);
      } else {
        await journalService.create(data);
      }

      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save journal entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal" style={{ maxWidth: "600px" }}>
        <h2>{journal ? "Edit Journal Entry" : "New Journal Entry"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mood</label>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="">Select your mood</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>What are you grateful for today?</label>
            <textarea
              value={gratefulFor}
              onChange={(e) => setGratefulFor(e.target.value)}
              rows="3"
              placeholder="List things you're grateful for..."
            />
          </div>

          <div className="form-group">
            <label>What went well today?</label>
            <textarea
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              rows="3"
              placeholder="Celebrate your wins..."
            />
          </div>

          <div className="form-group">
            <label>What could be improved?</label>
            <textarea
              value={whatToImprove}
              onChange={(e) => setWhatToImprove(e.target.value)}
              rows="3"
              placeholder="Areas for growth..."
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Any other thoughts or reflections..."
            />
          </div>

          <ErrorMessage message={error} />

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalForm;
