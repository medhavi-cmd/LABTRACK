import { pool } from "../config/db.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

const FACULTY_REQUEST_SORTS = {
  component: "c.component_name",
  quantity: "ri.quantity",
  team: "t.team_name",
  requested_by: "s.name",
  date: "cr.request_date",
  status: "cr.status",
};

// Counts cover every request, independent of the active filter.
export const getFacultyComponentRequestStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE LOWER(cr.status::text) = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE LOWER(cr.status::text) = 'approved')::int AS approved,
      COUNT(*) FILTER (WHERE LOWER(cr.status::text) = 'rejected')::int AS rejected
    FROM public.component_requests cr
    INNER JOIN public.request_items ri ON ri.request_id = cr.request_id
  `);
  return result.rows[0];
};

export const getFacultyComponentRequests = async ({
  search,
  status,
  sortField,
  sortDir,
} = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(
      search,
      ["c.component_name", "t.team_name", "s.name", "cr.purpose"],
      values
    ),
    buildFilterClause(status, "cr.status", values, { cast: "text" }),
  ]);

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
    ${where}
    ${buildOrderBy(sortField, sortDir, FACULTY_REQUEST_SORTS, "cr.request_date")}
  `;

  const result = await pool.query(query, values);

  return result.rows;
};
