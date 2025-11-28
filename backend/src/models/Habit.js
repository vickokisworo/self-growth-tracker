// backend/src/models/Habit.js - FIXED VERSION
const pool = require("../config/database");

class Habit {
  static async create(habitData) {
    const { user_id, name, description, frequency, reminder_time } = habitData;
    const query = `
      INSERT INTO habits (user_id, name, description, frequency, reminder_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      user_id,
      name,
      description,
      frequency,
      reminder_time,
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT h.*, 
        COUNT(hl.id) FILTER (WHERE hl.completed = true) as completed_count,
        MAX(hl.date) as last_completed
      FROM habits h
      LEFT JOIN habit_logs hl ON h.id = hl.habit_id
      WHERE h.user_id = $1 AND h.is_active = true
      GROUP BY h.id
      ORDER BY h.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = "SELECT * FROM habits WHERE id = $1 AND user_id = $2";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, habitData) {
    const { name, description, frequency, reminder_time, is_active } =
      habitData;
    const query = `
      UPDATE habits 
      SET name = $1, description = $2, frequency = $3, 
          reminder_time = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      name,
      description,
      frequency,
      reminder_time,
      is_active,
      id,
      userId,
    ]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query =
      "DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async logHabit(logData) {
    const { habit_id, completed, date, notes } = logData;
    const query = `
      INSERT INTO habit_logs (habit_id, completed, date, notes)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (habit_id, date) 
      DO UPDATE SET completed = $2, notes = $4
      RETURNING *
    `;
    const result = await pool.query(query, [
      habit_id,
      completed,
      date || new Date(),
      notes,
    ]);
    return result.rows[0];
  }

  static async getHabitLogs(habitId, startDate, endDate) {
    const query = `
      SELECT * FROM habit_logs
      WHERE habit_id = $1 AND date BETWEEN $2 AND $3
      ORDER BY date DESC
    `;
    const result = await pool.query(query, [habitId, startDate, endDate]);
    return result.rows;
  }

  static async getStreak(habitId) {
    // FIXED: Simplified query to avoid type mismatch
    const query = `
      SELECT COUNT(*) as streak
      FROM (
        SELECT date
        FROM habit_logs
        WHERE habit_id = $1 
          AND completed = true
          AND date >= (
            SELECT COALESCE(
              (
                SELECT MAX(date) + 1
                FROM habit_logs
                WHERE habit_id = $1
                  AND completed = false
                  AND date < CURRENT_DATE
              ),
              '1900-01-01'::date
            )
          )
          AND date <= CURRENT_DATE
        ORDER BY date DESC
      ) as consecutive_days
    `;

    try {
      const result = await pool.query(query, [habitId]);
      return result.rows[0] || { streak: 0 };
    } catch (error) {
      console.error("Error in getStreak:", error);
      // Fallback to simple count if query fails
      const fallbackQuery = `
        SELECT COUNT(*) as streak
        FROM habit_logs
        WHERE habit_id = $1 
          AND completed = true
          AND date >= CURRENT_DATE - INTERVAL '30 days'
      `;
      const fallbackResult = await pool.query(fallbackQuery, [habitId]);
      return fallbackResult.rows[0] || { streak: 0 };
    }
  }
}

module.exports = Habit;
