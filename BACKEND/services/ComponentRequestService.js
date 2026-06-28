import { pool } from "../config/db.js";

export const getAllRequests = async () => {
  const result = await pool.query(`
    SELECT
    cr.request_id,
    cr.request_date,
    cr.status,
    cr.purpose,
    c.component_name,
    ri.quantity,
    t.team_name,
    s.name AS student_name,
    s.enrollment_no
FROM component_requests cr
JOIN request_items ri
    ON cr.request_id = ri.request_id
JOIN components c
    ON ri.component_id = c.component_id
JOIN teams t
    ON cr.team_id = t.team_id
JOIN students s
    ON t.leader_id = s.student_id
ORDER BY cr.request_date DESC;`);

  return result.rows;
};