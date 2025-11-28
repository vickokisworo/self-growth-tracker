const pool = require("../config/database");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get progress stats
    const progressQuery = `
      SELECT 
        category,
        AVG(rating) as avg_rating,
        COUNT(*) as total_entries
      FROM progress
      WHERE user_id = $1 
      AND date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY category
    `;
    const progressResult = await pool.query(progressQuery, [userId]);

    // Get habit stats
    const habitQuery = `
      SELECT 
        COUNT(*) as total_habits,
        COUNT(*) FILTER (WHERE is_active = true) as active_habits
      FROM habits
      WHERE user_id = $1
    `;
    const habitResult = await pool.query(habitQuery, [userId]);

    // Get habit completion rate
    const habitCompletionQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE hl.completed = true) * 100.0 / 
        NULLIF(COUNT(*), 0) as completion_rate
      FROM habits h
      LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
      AND hl.date >= CURRENT_DATE - INTERVAL '7 days'
      WHERE h.user_id = $1 AND h.is_active = true
    `;
    const habitCompletionResult = await pool.query(habitCompletionQuery, [
      userId,
    ]);

    // Get goal stats
    const goalQuery = `
      SELECT 
        COUNT(*) as total_goals,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_goals,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_goals
      FROM goals
      WHERE user_id = $1
    `;
    const goalResult = await pool.query(goalQuery, [userId]);

    // Get goal progress
    const goalProgressQuery = `
      SELECT 
        AVG(CASE 
          WHEN total_steps > 0 
          THEN (completed_steps::float / total_steps * 100)
          ELSE 0 
        END) as avg_progress
      FROM (
        SELECT 
          g.id,
          COUNT(gs.id) as total_steps,
          COUNT(gs.id) FILTER (WHERE gs.completed = true) as completed_steps
        FROM goals g
        LEFT JOIN goal_steps gs ON g.id = gs.goal_id
        WHERE g.user_id = $1 AND g.status = 'in_progress'
        GROUP BY g.id
      ) as goal_stats
    `;
    const goalProgressResult = await pool.query(goalProgressQuery, [userId]);

    // Get journal stats
    const journalQuery = `
      SELECT 
        COUNT(*) as total_entries,
        COUNT(*) FILTER (WHERE date >= CURRENT_DATE - INTERVAL '7 days') as entries_this_week
      FROM journals
      WHERE user_id = $1
    `;
    const journalResult = await pool.query(journalQuery, [userId]);

    // Get recent progress trend
    const progressTrendQuery = `
      SELECT 
        date,
        AVG(rating) as avg_rating
      FROM progress
      WHERE user_id = $1 
      AND date >= CURRENT_DATE - INTERVAL '14 days'
      GROUP BY date
      ORDER BY date ASC
    `;
    const progressTrendResult = await pool.query(progressTrendQuery, [userId]);

    res.json({
      success: true,
      data: {
        progress: {
          categories: progressResult.rows,
          trend: progressTrendResult.rows,
        },
        habits: {
          ...habitResult.rows[0],
          completion_rate: habitCompletionResult.rows[0]?.completion_rate || 0,
        },
        goals: {
          ...goalResult.rows[0],
          avg_progress: goalProgressResult.rows[0]?.avg_progress || 0,
        },
        journals: journalResult.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
};
