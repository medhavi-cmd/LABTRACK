import { pool } from "../config/db.js";

export const getReturnHistory = async () => {
  const result = await pool.query(`
    SELECT
      ir.issue_id,

      'RET-' || LPAD(
        ROW_NUMBER() OVER (ORDER BY ir.actual_return_date DESC)::TEXT,
        3,
        '0'
      ) AS return_id,

      c.component_name,
      ri.quantity,

      ir.issue_date,
      ir.actual_return_date,
      ir.component_condition,

      s.name AS student_name,
    s.enrollment_no,
    t.team_name

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

    WHERE ir.return_status = 'returned'

    ORDER BY ir.actual_return_date DESC;
  `);

  return result.rows;
};