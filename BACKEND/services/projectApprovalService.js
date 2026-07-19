import { pool } from "../config/db.js";

export const getAllProjects = async () => {
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

      f.faculty_id,
      COALESCE(f.name, 'Not Assigned') AS guide

    FROM public.projects p

    INNER JOIN public.teams t
      ON t.team_id = p.team_id

    LEFT JOIN public.team_faculty tf
      ON tf.team_id = t.team_id

    LEFT JOIN public.faculty f
      ON f.faculty_id = tf.faculty_id

    ORDER BY
      p.created_at DESC,
      p.project_id DESC
  `;

  const result = await pool.query(query);

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
