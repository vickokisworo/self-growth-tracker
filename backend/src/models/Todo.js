// backend/src/models/Todo.js
const pool = require("../config/database");

class Todo {
  static async create(todoData) {
    const { user_id, title, description, priority, due_date } = todoData;
    const query = `
      INSERT INTO todos (user_id, title, description, priority, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      user_id,
      title,
      description || null,
      priority || "medium",
      due_date || null,
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT * FROM todos 
      WHERE user_id = $1
    `;
    const params = [userId];

    if (filters.date) {
      query += ` AND DATE(created_at) = $${params.length + 1}`;
      params.push(filters.date);
    }

    if (filters.completed !== undefined) {
      query += ` AND completed = $${params.length + 1}`;
      params.push(filters.completed);
    }

    query += " ORDER BY completed ASC, priority DESC, created_at DESC";

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = "SELECT * FROM todos WHERE id = $1 AND user_id = $2";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, todoData) {
    const { title, description, priority, due_date, completed } = todoData;
    const query = `
      UPDATE todos 
      SET title = $1, description = $2, priority = $3, 
          due_date = $4, completed = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      title,
      description,
      priority,
      due_date,
      completed,
      id,
      userId,
    ]);
    return result.rows[0];
  }

  static async toggleComplete(id, userId) {
    const query = `
      UPDATE todos 
      SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query =
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async deleteCompleted(userId) {
    const query =
      "DELETE FROM todos WHERE user_id = $1 AND completed = true RETURNING COUNT(*) as count";
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE completed = true) as completed,
        COUNT(*) FILTER (WHERE completed = false) as pending,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today
      FROM todos
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = Todo;
