import { pool } from "../config/db.js";

export const getFacultyDashboardData = async () => {
  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM public.projects)::int
        AS total_projects,

      (
        SELECT COUNT(*)
        FROM public.projects
        WHERE approval_status = 'approved'
      )::int AS approved_projects,

      (
        SELECT COUNT(*)
        FROM public.component_requests
        WHERE status = 'pending'
      )::int AS pending_requests,

      (
        SELECT COUNT(*)
        FROM public.events
        WHERE event_datetime > NOW()
      )::int AS upcoming_events
  `;

  const projectsQuery = `
    SELECT
      p.project_id AS id,
      p.project_title AS "Title",
      t.team_name AS "Team",
      INITCAP(p.approval_status) AS "Status",
      COALESCE(f.name, 'Not Assigned') AS "Faculty"
    FROM public.projects p

    INNER JOIN public.teams t
      ON t.team_id = p.team_id

    LEFT JOIN public.team_faculty tf
      ON tf.team_id = t.team_id

    LEFT JOIN public.faculty f
      ON f.faculty_id = tf.faculty_id

    ORDER BY p.created_at DESC, p.project_id DESC
    LIMIT 10
  `;

  const [statsResult, projectsResult] = await Promise.all([
    pool.query(statsQuery),
    pool.query(projectsQuery),
  ]);

  return {
    stats: statsResult.rows[0],
    projects: projectsResult.rows,
  };
};
