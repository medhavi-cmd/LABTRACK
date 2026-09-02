import { pool } from "../config/db.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

// Guides are aggregated in a subquery: joining team_faculty directly would
// repeat a project once per assigned guide.
const GUIDE_SQL = `
  COALESCE((
    SELECT STRING_AGG(DISTINCT f.name, ', ')
    FROM public.team_faculty tf
    JOIN public.faculty f ON f.faculty_id = tf.faculty_id
    WHERE tf.team_id = t.team_id
  ), 'Not Assigned')
`;

const PROJECT_SORTS = {
  title: "p.project_title",
  team: "t.team_name",
  status: "p.approval_status",
  guide: GUIDE_SQL,
  created_at: "p.created_at",
};

// Counts cover every project, independent of the active filter.
export const getProjectStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE LOWER(approval_status::text) = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE LOWER(approval_status::text) = 'approved')::int AS approved,
      COUNT(*) FILTER (WHERE LOWER(approval_status::text) = 'rejected')::int AS rejected
    FROM public.projects
  `);
  return result.rows[0];
};

export const getAllProjects = async ({ search, status, sortField, sortDir } = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(search, ["p.project_title", "t.team_name", GUIDE_SQL], values),
    buildFilterClause(status, "p.approval_status", values, { cast: "text" }),
  ]);

  const query = `
    SELECT
      p.project_id AS id,
      p.project_title AS title,
      p.description,
      p.objective,
      p.report_file,
      p.cover_image,
      p.project_status,
      INITCAP(p.approval_status) AS status,
      p.approved_at,
      p.faculty_remarks,
      p.created_at,

      t.team_id,
      t.team_name AS team,

      ${GUIDE_SQL} AS guide

    FROM public.projects p

    INNER JOIN public.teams t
      ON t.team_id = p.team_id
    ${where}
    ${buildOrderBy(sortField, sortDir, PROJECT_SORTS, "p.created_at")}
  `;

  const result = await pool.query(query, values);

  return result.rows;
};

export const updateProjectApprovalStatus = async ({
  projectId,
  status,
  facultyId,
  remarks,
}) => {
const query = `
  UPDATE public.projects
  SET
    approval_status = $1::varchar,
    approved_by = $2,
    approved_at = CASE
      WHEN $1::varchar IN ('approved', 'rejected')
      THEN NOW()
      ELSE NULL
    END,
    faculty_remarks = $3
  WHERE project_id = $4
  RETURNING
    project_id AS id,
    project_title AS title,
    INITCAP(approval_status) AS status,
    approved_by,
    approved_at,
    faculty_remarks
`;

  const values = [
    status,
    facultyId,
    remarks,
    projectId,
  ];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};
