import { pool } from "../config/db.js";

export const getDamageComponents = async () => {
  const result = await pool.query(`
    SELECT
      ir.issue_id,
      dr.damage_id,
      c.component_name,
      ir.component_condition,
      ir.actual_return_date,
      dr.severity,
      dr.description,
      s.name AS student_name,
      s.enrollment_no,
      s.year AS batch,
      u.email,
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

    JOIN users u
      ON s.user_id = u.user_id

    LEFT JOIN damage_reports dr
      ON ir.issue_id = dr.issue_id

    WHERE ir.return_status = 'returned'
      AND ir.component_condition IN ('fair', 'damaged')

    ORDER BY ir.actual_return_date DESC;
  `);

  return result.rows.map((row) => ({
    reportId: `DMG-${row.issue_id}`,
    issue_id: row.issue_id,

    component: row.component_name,

    damageType:
      row.component_condition === "damaged"
        ? "Physical Damage"
        : "Minor Damage",

    severity:
      row.component_condition === "damaged"
        ? "High"
        : "Medium",

    reportDate: row.actual_return_date,

    penalty: 0,

    status: "Pending",

    description: `Component returned in ${row.component_condition} condition.`,

    resolutionNotes: "",

    student: {
      name: row.student_name || "—",
      enrollmentNo: row.enrollment_no || "—",
      batch: row.batch || "—",
      group: row.team_name || "—",
      email: row.email || "—",
    },
  }));
};

export const resolveDamage = async (issueId) => {
  // TODO: implement later
  return {
    success: true,
    message: "Damage report marked as resolved.",
  };
};

export const addDamageReport = async () => {
  // TODO: implement later
  return {
    success: true,
    message: "Damage report created.",
  };
};