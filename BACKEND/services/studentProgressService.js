import { pool } from "../config/db.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

/*
  project_evaluations in this database is keyed by project_id and has no
  `completed` flag: an evaluation counts as done once marks_obtained is set.
  Ordering comes from evaluation_date, since there is no explicit order column.
*/

const PROGRESS_STATUS_SQL = `
  CASE
    WHEN p.approval_status = 'approved' THEN 'Excellent'
    WHEN p.approval_status = 'pending' THEN 'On Track'
    WHEN p.approval_status = 'rejected' THEN 'Review Required'
    ELSE 'On Track'
  END
`;

const GUIDE_SQL = `
  COALESCE((
    SELECT STRING_AGG(DISTINCT f2.name, ', ')
    FROM team_faculty tf2
    JOIN faculty f2 ON f2.faculty_id = tf2.faculty_id
    WHERE tf2.team_id = t.team_id
  ), 'Not Assigned')
`;

const PROGRESS_SORTS = {
  team_name: "t.team_name",
  project_title: "p.project_title",
  guide_name: GUIDE_SQL,
  progress_status: PROGRESS_STATUS_SQL,
};

/* ─────────────────────────────────────────
   GET ALL TEAMS WITH PROGRESS SUMMARY
───────────────────────────────────────── */
export const getAllTeamProgress = async ({
  search,
  progressStatus,
  sortField,
  sortDir,
} = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(search, ["t.team_name", "p.project_title", GUIDE_SQL], values),
    buildFilterClause(progressStatus, PROGRESS_STATUS_SQL, values, {
      allowedValues: ["Excellent", "On Track", "Review Required"],
    }),
  ]);

  const result = await pool.query(`
    SELECT
      t.team_id,
      t.team_name,
      p.project_id,
      p.project_title,
      INITCAP(p.approval_status) AS status,
      ${GUIDE_SQL} AS guide_name,
      (
        SELECT COUNT(*) FROM team_members tm2
        WHERE tm2.team_id = t.team_id
      )::int AS member_count,
      COALESCE((
        SELECT
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(
            SUM(CASE WHEN pe.marks_obtained IS NOT NULL THEN 1 ELSE 0 END)::numeric
            / COUNT(*)::numeric * 100
          )
          END
        FROM project_evaluations pe
        WHERE pe.project_id = p.project_id
      ), 0)::int AS progress_percent,
      COALESCE((
        SELECT pe.evaluation_name
        FROM project_evaluations pe
        WHERE pe.project_id = p.project_id AND pe.marks_obtained IS NOT NULL
        ORDER BY pe.evaluation_date DESC NULLS LAST, pe.evaluation_id DESC
        LIMIT 1
      ), 'Not Started') AS current_stage,
      ${PROGRESS_STATUS_SQL} AS progress_status
    FROM teams t
    JOIN projects p ON p.team_id = t.team_id
    ${where}
    ${buildOrderBy(sortField, sortDir, PROGRESS_SORTS, "t.team_name")}
  `, values);

  return result.rows;
};

/* ─────────────────────────────────────────
   GET TEAM PROGRESS DETAIL BY TEAM ID
───────────────────────────────────────── */
export const getTeamProgressDetail = async (teamId) => {
  const teamResult = await pool.query(`
    SELECT
      t.team_id,
      t.team_name,
      p.project_id,
      p.project_title,
      p.description,
      p.faculty_remarks,
      INITCAP(p.approval_status) AS status,
      COALESCE((
        SELECT STRING_AGG(DISTINCT f.name, ', ')
        FROM team_faculty tf
        JOIN faculty f ON f.faculty_id = tf.faculty_id
        WHERE tf.team_id = t.team_id
      ), 'Not Assigned') AS guide_name,
      (
        SELECT COUNT(*) FROM team_members tm2
        WHERE tm2.team_id = t.team_id
      )::int AS member_count
    FROM teams t
    JOIN projects p ON p.team_id = t.team_id
    WHERE t.team_id = $1
    LIMIT 1
  `, [teamId]);

  if (!teamResult.rows[0]) return null;
  const { faculty_remarks: facultyRemarks, ...team } = teamResult.rows[0];

  const membersResult = await pool.query(`
    SELECT
      s.student_id,
      s.name,
      s.enrollment_no,
      tm.project_role AS role
    FROM team_members tm
    JOIN students s ON s.student_id = tm.student_id
    WHERE tm.team_id = $1
    ORDER BY
      CASE WHEN tm.project_role = 'leader' THEN 0 ELSE 1 END, s.name
  `, [teamId]);

  const evalsResult = await pool.query(`
    SELECT
      evaluation_id AS eval_id,
      evaluation_name AS eval_name,
      evaluation_date::text AS eval_date,
      marks_obtained,
      total_marks AS max_marks,
      remarks,
      (marks_obtained IS NOT NULL) AS completed,
      ROW_NUMBER() OVER (
        ORDER BY evaluation_date NULLS LAST, evaluation_id
      )::int AS eval_order
    FROM project_evaluations
    WHERE project_id = $1
    ORDER BY evaluation_date NULLS LAST, evaluation_id
  `, [team.project_id]);

  const graphData = evalsResult.rows.map((ev) => ({
    stage: ev.eval_name,
    progress: ev.completed
      ? ev.max_marks > 0
        ? Math.round((ev.marks_obtained / ev.max_marks) * 100)
        : 100
      : 0,
  }));

  const completedCount = evalsResult.rows.filter((e) => e.completed).length;
  const totalCount = evalsResult.rows.length;
  const progressPercent = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const currentStage = evalsResult.rows
    .filter((e) => e.completed)
    .sort((a, b) => b.eval_order - a.eval_order)[0]?.eval_name ?? "Not Started";

  // Faculty feedback lives on projects.faculty_remarks; there is no remarks table.
  const remarks = facultyRemarks?.trim()
    ? [{
        remark_id: `project-${team.project_id}`,
        remark_text: facultyRemarks,
        faculty_name: team.guide_name,
        created_at: null,
      }]
    : [];

  return {
    ...team,
    progress_percent: progressPercent,
    current_stage: currentStage,
    members: membersResult.rows,
    evaluations: evalsResult.rows,
    graph_data: graphData,
    remarks,
  };
};

/* ─────────────────────────────────────────
   GET STUDENT PROGRESS STATS
───────────────────────────────────────── */
export const getStudentProgressStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM teams t JOIN projects p ON p.team_id = t.team_id)::int AS active_teams,
      (
        SELECT COUNT(*)
        FROM teams t JOIN projects p ON p.team_id = t.team_id
        WHERE p.approval_status = 'approved'
      )::int AS on_track,
      (
        SELECT COUNT(*)
        FROM teams t JOIN projects p ON p.team_id = t.team_id
        WHERE p.approval_status = 'rejected'
      )::int AS needs_review,
      (
        SELECT COUNT(*)
        FROM teams t
        JOIN projects p ON p.team_id = t.team_id
        WHERE (
          SELECT COUNT(*) FROM project_evaluations pe
          WHERE pe.project_id = p.project_id AND pe.marks_obtained IS NOT NULL
        ) = (
          SELECT COUNT(*) FROM project_evaluations pe2
          WHERE pe2.project_id = p.project_id
        ) AND (
          SELECT COUNT(*) FROM project_evaluations pe3
          WHERE pe3.project_id = p.project_id
        ) > 0
      )::int AS completed
  `);
  return result.rows[0];
};
