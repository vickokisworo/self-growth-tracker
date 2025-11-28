const pool = require("../config/database");

class Journal {
  static async create(journalData) {
    const {
      user_id,
      date,
      mood,
      grateful_for,
      what_went_well,
      what_to_improve,
      notes,
    } = journalData;
    const query = `
      INSERT INTO journals (user_id, date, mood, grateful_for, what_went_well, what_to_improve, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      user_id,
      date || new Date(),
      mood,
      grateful_for,
      what_went_well,
      what_to_improve,
      notes,
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 30) {
    const query = `
      SELECT * FROM journals
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = "SELECT * FROM journals WHERE id = $1 AND user_id = $2";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async findByDate(userId, date) {
    const query = "SELECT * FROM journals WHERE user_id = $1 AND date = $2";
    const result = await pool.query(query, [userId, date]);
    return result.rows[0];
  }

  static async update(id, userId, journalData) {
    const { date, mood, grateful_for, what_went_well, what_to_improve, notes } =
      journalData;
    const query = `
      UPDATE journals 
      SET date = $1, mood = $2, grateful_for = $3, 
          what_went_well = $4, what_to_improve = $5, notes = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING *
    `;
    const result = await pool.query(query, [
      date,
      mood,
      grateful_for,
      what_went_well,
      what_to_improve,
      notes,
      id,
      userId,
    ]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query =
      "DELETE FROM journals WHERE id = $1 AND user_id = $2 RETURNING id";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = Journal;
