import { pool } from "../config/db.js";

export const getAllRequests = async () => {
  const result = await pool.query(`
    SELECT *
    FROM component_requests
    ORDER BY request_date DESC
  `);

  return result.rows;
};