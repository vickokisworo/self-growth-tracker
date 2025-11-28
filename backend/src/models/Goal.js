const pool = require("../config/database");

class Goal {
  static async create(goalData) {
    const { user_id, title, description, why_important, deadline } = goalData;
    const query = `
      INSERT INTO goals (user_id, title, description, why_important, deadline)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      user_id,
      title,
      description,
      why_important,
      deadline,
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT g.*, 
        COUNT(gs.id) as total_steps,
        COUNT(gs.id) FILTER (WHERE gs.completed = true) as completed_steps
      FROM goals g
      LEFT JOIN goal_steps gs ON g.id = gs.goal_id
      WHERE g.user_id = $1
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = `
      SELECT g.*, 
        COUNT(gs.id) as total_steps,
        COUNT(gs.id) FILTER (WHERE gs.completed = true) as completed_steps
      FROM goals g
      LEFT JOIN goal_steps gs ON g.id = gs.goal_id
      WHERE g.id = $1 AND g.user_id = $2
      GROUP BY g.id
    `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, goalData) {
    const { title, description, why_important, deadline, status } = goalData;
    const query = `
      UPDATE goals 
      SET title = $1, description = $2, why_important = $3, 
          deadline = $4, status = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      title,
      description,
      why_important,
      deadline,
      status,
      id,
      userId,
    ]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query =
      "DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async addStep(stepData) {
    const { goal_id, step_title, order_number } = stepData;
    const query = `
      INSERT INTO goal_steps (goal_id, step_title, order_number)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [goal_id, step_title, order_number]);
    return result.rows[0];
  }

  static async getSteps(goalId) {
    const query = `
      SELECT * FROM goal_steps
      WHERE goal_id = $1
      ORDER BY order_number ASC
    `;
    const result = await pool.query(query, [goalId]);
    return result.rows;
  }

  static async updateStep(stepId, completed) {
    const query = `
      UPDATE goal_steps 
      SET completed = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [completed, stepId]);
    return result.rows[0];
  }

  static async deleteStep(stepId) {
    const query = "DELETE FROM goal_steps WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [stepId]);
    return result.rows[0];
  }
}

module.exports = Goal;
