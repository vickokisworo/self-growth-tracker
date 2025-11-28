const pool = require("../config/database");

class User {
  static async create(userData) {
    const { username, email, password, role = "user" } = userData;
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at
    `;
    const result = await pool.query(query, [username, email, password, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  static async findById(id) {
    const query =
      "SELECT id, username, email, role, created_at FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { username, email } = userData;
    const query = `
      UPDATE users 
      SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, username, email, role, updated_at
    `;
    const result = await pool.query(query, [username, email, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = "DELETE FROM users WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;
