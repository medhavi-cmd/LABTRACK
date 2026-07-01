import { pool } from "../config/db.js";

export const getAllIssuedComponents = async () => {
  const result = await pool.query(`
    SELECT
        ir.issue_id,
        cr.request_id,

        c.component_name,
        ri.quantity,

        s.name AS leader_name,
        s.enrollment_no,

        t.team_name,

        ir.issue_date,
        ir.expected_return_date,
        ir.actual_return_date,
        ir.return_status

    FROM issue_records ir

    JOIN component_requests cr
        ON ir.request_id = cr.request_id

    JOIN request_items ri
        ON cr.request_id = ri.request_id

    JOIN components c
        ON ri.component_id = c.component_id

    JOIN teams t
        ON cr.team_id = t.team_id

    JOIN students s
        ON t.leader_id = s.student_id

    ORDER BY ir.issue_date DESC;
  `);

  return result.rows;
};