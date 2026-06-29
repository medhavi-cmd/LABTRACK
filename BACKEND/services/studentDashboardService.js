import { pool } from "../config/db.js";

export const getDashboardData = async (userId) => {
    // Find logged in student's team
    const teamQuery = `
    SELECT tm.team_id
    FROM students s
    JOIN team_members tm
      ON s.student_id = tm.student_id
    WHERE s.user_id = $1
    LIMIT 1;
  `;

    const teamResult = await pool.query(teamQuery, [userId]);

    if (teamResult.rows.length === 0) {
        throw new Error("Team not found");
    }

    const teamId = teamResult.rows[0].team_id;

    // -------------------------------
    // Total Requests
    // -------------------------------

    const totalResult = await pool.query(
        `
    SELECT COUNT(*)::int AS total
    FROM component_requests
    WHERE team_id = $1
    `,
        [teamId]
    );

    // -------------------------------
    // Pending Requests
    // -------------------------------

    const pendingResult = await pool.query(
        `
    SELECT COUNT(*)::int AS pending
    FROM component_requests
    WHERE team_id = $1
      AND status = 'pending'
    `,
        [teamId]
    );

    // -------------------------------
    // Issued Components
    // -------------------------------

    const issuedResult = await pool.query(
        `
    SELECT
    COALESCE(SUM(ri.quantity),0)::int AS issued
    FROM issue_records ir
    JOIN component_requests cr
      ON ir.request_id = cr.request_id
    JOIN request_items ri
      ON ri.request_id = cr.request_id
    WHERE cr.team_id = $1
    `,
        [teamId]
    );

    // -------------------------------
    // Returned Components
    // -------------------------------

    const returnedResult = await pool.query(
        `
    SELECT
    COALESCE(SUM(ri.quantity),0)::int AS returned
    FROM issue_records ir
    JOIN component_requests cr
      ON ir.request_id = cr.request_id
    JOIN request_items ri
      ON ri.request_id = cr.request_id
    WHERE cr.team_id = $1
      AND ir.return_status = 'returned'
    `,
        [teamId]
    );

    // -------------------------------
    // Recent Activity
    // -------------------------------

    const activityResult = await pool.query(
        `
    SELECT
      ri.request_item_id,
    cr.request_id,
    c.component_name,
      ri.quantity,
      cr.status,
      cr.request_date

    FROM component_requests cr

    JOIN request_items ri
      ON cr.request_id = ri.request_id

    JOIN components c
      ON ri.component_id = c.component_id

    WHERE cr.team_id = $1

    ORDER BY cr.request_date DESC

    LIMIT 5
    `,
        [teamId]
    );

    return {
        totalRequests: totalResult.rows[0].total,

        pendingRequests: pendingResult.rows[0].pending,

        issuedComponents: issuedResult.rows[0].issued,

        returnedComponents: returnedResult.rows[0].returned,

        recentActivity: activityResult.rows,
    };
};