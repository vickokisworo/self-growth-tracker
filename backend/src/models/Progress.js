const pool = require("../config/database");

class Progress {
  static async create(progressData) {
    const { user_id, category, rating, notes, date } = progressData;
    const query = `
      INSERT INTO progress (user_id, category, rating, notes, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      user_id,
      category,
      rating,
      notes,
      date || new Date(),
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = "SELECT * FROM progress WHERE user_id = $1";
    const params = [userId];

    if (filters.category) {
      query += " AND category = $2";
      params.push(filters.category);
    }

    if (filters.startDate && filters.endDate) {
      query += ` AND date BETWEEN $${params.length + 1} AND $${
        params.length + 2
      }`;
      params.push(filters.startDate, filters.endDate);
    }

    query += " ORDER BY date DESC";

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = "SELECT * FROM progress WHERE id = $1 AND user_id = $2";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, progressData) {
    const { category, rating, notes, date } = progressData;
    const query = `
      UPDATE progress 
      SET category = $1, rating = $2, notes = $3, date = $4
      WHERE id = $5 AND user_id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [
      category,
      rating,
      notes,
      date,
      id,
      userId,
    ]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query =
      "DELETE FROM progress WHERE id = $1 AND user_id = $2 RETURNING id";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async getAverageByCategory(userId, category, days = 7) {
    const query = `
      SELECT AVG(rating) as average
      FROM progress
      WHERE user_id = $1 AND category = $2 
      AND date >= CURRENT_DATE - INTERVAL '${days} days'
    `;
    const result = await pool.query(query, [userId, category]);
    return result.rows[0];
  }
}

module.exports = Progress;
