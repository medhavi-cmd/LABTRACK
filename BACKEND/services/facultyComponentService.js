import { pool } from "../config/db.js";

export const getFacultyComponentRequests = async () => {
  const query = `
    SELECT
      cr.request_id AS id,
      c.component_name AS component,
      ri.quantity,
      t.team_name AS team,
      s.name AS requested_by,
      cr.purpose,
      TO_CHAR(cr.request_date, 'DD-MM-YYYY') AS date,
      INITCAP(cr.status::text) AS status
    FROM public.component_requests cr
    INNER JOIN public.request_items ri
      ON ri.request_id = cr.request_id
    INNER JOIN public.components c
      ON c.component_id = ri.component_id
    INNER JOIN public.teams t
      ON t.team_id = cr.team_id
    LEFT JOIN public.students s
      ON s.student_id = t.leader_id
    ORDER BY cr.request_date DESC, cr.request_id DESC
  `;

  const result = await pool.query(query);

  return result.rows;
};
