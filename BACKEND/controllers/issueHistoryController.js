import { pool } from "../config/db.js";

export const getIssueHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find student's team
    const teamResult = await pool.query(
      `
      SELECT tm.team_id
      FROM team_members tm
      JOIN students s
      ON tm.student_id = s.student_id
      WHERE s.user_id = $1
      `,
      [userId]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        message: "No Team Found",
      });
    }

    const teamId = teamResult.rows[0].team_id;

    // Fetch all requests

    const result = await pool.query(
      `
      SELECT

      cr.request_id,
      cr.request_date,
      cr.status,
      cr.purpose,

      ir.issue_date,
      ir.expected_return_date,
      ir.actual_return_date,
      ir.return_status,

      c.component_name,
      ri.quantity

      FROM component_requests cr

      JOIN request_items ri
      ON cr.request_id = ri.request_id

      JOIN components c
      ON c.component_id = ri.component_id

      LEFT JOIN issue_records ir
      ON ir.request_id = cr.request_id

      WHERE cr.team_id = $1

      ORDER BY cr.request_date DESC
      `,
      [teamId]
    );

    const grouped = {};

    result.rows.forEach((row) => {
      if (!grouped[row.request_id]) {
        grouped[row.request_id] = {
          requestId: row.request_id,
          requestDate: row.request_date,
          purpose: row.purpose,
          status: row.status,

          issueDate: row.issue_date,
          expectedReturnDate: row.expected_return_date,
          actualReturnDate: row.actual_return_date,
          returnStatus: row.return_status,

          components: [],
        };
      }

      grouped[row.request_id].components.push({
        componentName: row.component_name,
        quantity: row.quantity,
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};