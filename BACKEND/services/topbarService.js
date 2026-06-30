import { pool } from "../config/db.js";

export const getTopbarData = async (userId) => {
  const userQuery = `
    SELECT
      full_name,
      role
    FROM users
    WHERE user_id = $1;
  `;

  const notificationQuery = `
    SELECT COUNT(*)::int AS unread_notifications
    FROM notifications
    WHERE user_id = $1
      AND is_read = false;
  `;

  const userResult = await pool.query(userQuery, [userId]);

  if (userResult.rows.length === 0) {
    throw new Error("User not found");
  }

  const notificationResult = await pool.query(notificationQuery, [userId]);

  return {
    ...userResult.rows[0],
    unreadNotifications:
      notificationResult.rows[0].unread_notifications,
  };
};