import { pool } from "../config/db.js";

export const getNextEvent = async () => {
  const query = `
      SELECT
        event_name,
        event_description,
        event_datetime
      FROM events
      WHERE event_datetime >= NOW()
      ORDER BY event_datetime ASC
      LIMIT 1
  `;

  const { rows } = await pool.query(query);

  return rows[0] || null;
};