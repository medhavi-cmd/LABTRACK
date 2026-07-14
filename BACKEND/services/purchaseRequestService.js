import { pool } from "../config/db.js";

/* ==========================================
   GET TEAM DETAILS OF LOGGED-IN STUDENT
========================================== */
export const getTeamDetailsForRequest = async (userId) => {
  const result = await pool.query(
    `
    SELECT
        t.team_id,
        t.team_name,
        p.project_title,

        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'faculty_id', f.faculty_id,
                        'name', f.name,
                        'department', f.department
                    )
                )
                FROM team_faculty tf
                JOIN faculty f
                    ON f.faculty_id = tf.faculty_id
                WHERE tf.team_id = t.team_id
            ),
            '[]'
        ) AS faculty

    FROM students s

    JOIN team_members tm
        ON tm.student_id = s.student_id

    JOIN teams t
        ON t.team_id = tm.team_id

    LEFT JOIN projects p
        ON p.team_id = t.team_id

    WHERE s.user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};

/* ==========================================
   CREATE PURCHASE REQUEST
========================================== */
export const createPurchaseRequest = async (userId, data) => {
  const {
    componentName,
    quantityRequired,
    reason,
    category,
  } = data;

  // Find the logged-in student's team
  const teamResult = await pool.query(
    `
    SELECT
        t.team_id
    FROM students s

    JOIN team_members tm
        ON tm.student_id = s.student_id

    JOIN teams t
        ON t.team_id = tm.team_id

    WHERE s.user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  if (teamResult.rows.length === 0) {
    throw new Error("You are not part of any team.");
  }

  const teamId = teamResult.rows[0].team_id;

  const result = await pool.query(
    `
    INSERT INTO component_purchase_requests
    (
        team_id,
        component_name,
        category,
        quantity_required,
        reason
    )
    VALUES
    (
        $1,
        $2,
        $3,
        $4,
        $5
    )
    RETURNING *
    `,
    [
      teamId,
      componentName,
      category || null,
      quantityRequired,
      reason,
    ]
  );

  return result.rows[0];
};

/* ==========================================
   GET ALL PURCHASE REQUESTS OF MY TEAM
========================================== */
export const getPurchaseRequestsByTeam = async (userId) => {
  const result = await pool.query(
    `
    SELECT
        cpr.purchase_request_id,
        cpr.component_name,
        cpr.category,
        cpr.quantity_required,
        cpr.reason,
        cpr.request_date,
        cpr.status,
        cpr.remarks

    FROM component_purchase_requests cpr

    JOIN teams t
        ON cpr.team_id = t.team_id

    JOIN team_members tm
        ON tm.team_id = t.team_id

    JOIN students s
        ON s.student_id = tm.student_id

    WHERE s.user_id = $1

    ORDER BY cpr.request_date DESC
    `,
    [userId]
  );

  return result.rows;
};